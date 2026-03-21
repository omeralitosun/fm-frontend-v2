<script setup lang="ts">
import { FloatLabel } from 'primevue';
import Select from 'primevue/select';
import type { IEquipmentService } from "@/service/IEquipmentService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { Equipment } from '@/model/equipment/Equipment';
import { Maintenance } from '@/model/maintenance/Maintenance';
import { MaintenanceType } from '@/constants/MaintenanceType';
import type { IMaintenanceService } from '@/service/IMaintenanceService';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import { CreateMaintenance } from '@/model/maintenance/CreateMaintenance';

const equipmentService: IEquipmentService = ServiceController.getEquipmentService();
const maintenanceService: IMaintenanceService = ServiceController.getMaintenanceService();
const loading = ref(false);
const $router = useRouter();
const toast = useToast();

const equipments = ref<Equipment[]>([]);

const equipment = ref<Equipment>();
const maintenanceType = ref<MaintenanceType>();
const maintenance = new Maintenance();

let rowSize = 5;
let productTypeFilterValue = '';

onMounted(async () => {
    fetchEquipments();
});

async function fetchEquipments() {
    loading.value = true;
    equipments.value = (await equipmentService.getAllEquipment(0, rowSize)).equipments;
    loading.value = false;
};

async function confirmAddEquipment() {

    loading.value = true;
    try {
        let createMaintenance: CreateMaintenance = new CreateMaintenance();
        if (!equipment.value || !maintenanceType.value || !maintenance.date) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ekipman seçimi, bakım tipi ve tarihi zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        createMaintenance.equipmentId = equipment.value.id;
        createMaintenance.maintenanceType = maintenanceType.value.key;
        createMaintenance.date = maintenance.date;
        createMaintenance.cost = maintenance.cost;
        createMaintenance.comment = maintenance.comment;

        const response = await maintenanceService.addMaintenance(createMaintenance);

        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ekipman bakımı başarıyla eklendi.', life: 3000 });

        await $router.push('/equipment/' + createMaintenance.equipmentId);
    } catch (error) {
        console.error("Error adding equipment:", error);
    } finally {
        loading.value = false;
    }

}

async function onEquipmentScroll(event: { first: number; last: number; }) {
    if ((event.last % rowSize) === 0 && event.last >= equipments.value.length) {
        const moreEquipments = await equipmentService.getAllEquipment(event.last / rowSize, rowSize);
        equipments.value = [...equipments.value, ...moreEquipments.equipments];
    }
}

async function onEquipmentFilter(event: { value: string; }) {
    productTypeFilterValue = event.value;
    fetchEquipments();
    loading.value = false;
}

</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
            <h1 class="text-2xl font-bold">Ekipman Bakımı Ekleme</h1>
            <Button label="Kaydet" icon="pi pi-check" severity="success" rounded :loading="loading"
                @click="confirmAddEquipment()" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <Select v-model="equipment" inputId="equipment" :options="equipments" optionLabel="name"
                        class="w-full" :virtualScrollerOptions="{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: onEquipmentScroll
                        }" :filter="true" filterPlaceholder="Ekipman ara..." @filter="onEquipmentFilter">
                        <template #footer>
                            <div class="p-3 border-t border-gray-100">
                                <Button label="Yeni Ekipman" fluid severity="secondary" variant="text" size="small"
                                    icon="pi pi-plus" @click="$router.push('/equipment/create')" />
                            </div>
                        </template>
                    </Select>
                    <label for="equipment">Ekipman</label>
                </FloatLabel>
            </div>

            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <Select v-model="maintenanceType" inputId="maintenanceType"
                        :options="MaintenanceType.values()" optionLabel="label" class="w-full" />
                    <label for="maintenanceType">Bakım Tipi</label>
                </FloatLabel>
            </div>

            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <DatePicker id="maintenanceDate" v-model="maintenance.date" class="w-full" showIcon
                        dateFormat="dd/mm/yy" />
                    <label for="maintenanceDate">Bakım Tarihi</label>
                </FloatLabel>
            </div>

            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputNumber v-model="maintenance.cost" inputId="maintenanceCost" mode="currency" currency="TRY"
                        locale="tr-TR" class="w-full" />
                    <label for="maintenanceCost">Maliyet</label>
                </FloatLabel>
            </div>

            <div class="flex flex-col gap-2 md:col-span-2 lg:col-span-2">
                <FloatLabel variant="on">
                    <Textarea id="maintenanceComment" v-model="maintenance.comment" rows="3" class="w-full"
                        style="resize: none" />
                    <label for="maintenanceComment">Açıklama</label>
                </FloatLabel>
            </div>
        </div>
    </div>
</template>