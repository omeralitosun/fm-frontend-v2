<script setup lang="ts">
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import type { IEquipmentService } from "@/service/IEquipmentService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { CreateEquipment } from '@/model/equipment/CreateEquipment';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { Equipment } from '@/model/equipment/Equipment';
import { Maintenance } from '@/model/maintenance/Maintenance';
import type { MaintenanceType } from '@/constants/MaintenanceType';
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

onMounted(async () => {
    fetchEquipments();
});

async function fetchEquipments() {
    loading.value = true;
    equipments.value = await equipmentService.getAllEquipment(0, 0);
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

        console.log("Adding equipment:", createMaintenance);
        const response = await maintenanceService.addMaintenance(createMaintenance);
        console.log(response.data);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ekipman bakımı başarıyla eklendi.', life: 3000 });

        await $router.push('/maintenance/' + response.data.id);
    } catch (error) {
        console.error("Error adding equipment:", error);
    } finally {
        loading.value = false;
    }

}

</script>

<template>
    <div class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Ekipman Bakımı</h1>
            <div class="right-0 mr-10 absolute">
                <Button label="Kaydet" icon="pi pi-check" class="mb-4" severity="success" :loading="loading"
                    @click="confirmAddEquipment()" />
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6 mb">
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="equipment" inputId="equipment" :options="equipments" optionLabel="name"
                        class="w-full">
                        <template #footer>
                            <div class="p-3">
                                <Button label="Yeni Ekipman" fluid severity="secondary" variant="text" size="small"
                                    icon="pi pi-plus" @click="$router.push('/equipment/create')" />
                            </div>
                        </template>
                    </Select>
                    <label for="equipment">Ekipman</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="maintenanceType" inputId="maintenanceType"
                        :options="maintenanceService.getMaintenanceTypes()" optionLabel="label" class="w-full" />
                    <label for="maintenanceType">Bakım Tipi</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <DatePicker id="maintenanceDate" v-model="maintenance.date" class="w-full" showIcon
                        dateFormat="dd/mm/yy" />
                    <label for="maintenanceDate">Bakım Tarihi</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputNumber v-model="maintenance.cost" inputId="currency-us" mode="currency" currency="TRY"
                        locale="en-TR" fluid />
                    <label for="maintenanceDate">Bakım Maliyeti</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 md:mt-5">
                <FloatLabel variant="on">
                    <Textarea id="maintenanceComment" v-model="maintenance.comment" rows="5" cols="50"
                        style="resize: none" />
                    <label for="maintenanceComment">Not</label>
                </FloatLabel>
            </div>
        </div>
    </div>
</template>