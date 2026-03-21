<script setup lang="ts">
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import type { IEquipmentService } from "@/service/IEquipmentService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref } from 'vue';
import { Equipment } from '@/model/equipment/Equipment';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import type { EquipmentType } from '@/constants/EquipmentType';

const equipmentService: IEquipmentService = ServiceController.getEquipmentService();
const loading = ref(false);
const $router = useRouter();
const toast = useToast();

const equipmentName = ref<string>();
const equipmentType = ref<EquipmentType>();

async function confirmAddEquipment() {
    loading.value = true;
    try {
        let equipment: Equipment = new Equipment();
        if (!equipmentName.value || !equipmentType.value) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ekipman adı ve tipi zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        equipment.name = equipmentName.value;
        equipment.equipmentType = equipmentType.value.key;

        const response = await equipmentService.addEquipment(equipment);

        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ekipman başarıyla eklendi.', life: 3000 });

        await $router.push('/equipment/' + response.data.id);
    } catch (error) {
        console.error("Error adding equipment:", error);
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
            <h1 class="text-2xl font-bold">Yeni Ekipman</h1>
            <Button label="Kaydet" icon="pi pi-check" severity="success" rounded :loading="loading"
                @click="confirmAddEquipment()" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputText id="equipmentName" v-model="equipmentName" class="w-full" />
                    <label for="equipmentName">Ekipman Adı</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <Select v-model="equipmentType" inputId="equipmentType"
                        :options="equipmentService.getEquipmentTypes()" optionLabel="label" class="w-full" />
                    <label for="equipmentType">Ekipman Tipi</label>
                </FloatLabel>
            </div>
        </div>
    </div>
</template>