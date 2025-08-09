<script setup lang="ts">
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import type { IEquipmentService } from "@/service/IEquipmentService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref } from 'vue';
import { CreateEquipment } from '@/model/equipment/CreateEquipment';
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
        let createEquipment: CreateEquipment = new CreateEquipment();
        if (!equipmentName.value || !equipmentType.value) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ekipman adı ve tipi zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        createEquipment.name = equipmentName.value;
        createEquipment.equipmentType = equipmentType.value.key;

        console.log("Adding equipment:", createEquipment);
        const response = await equipmentService.addEquipment(createEquipment);
        console.log(response.data);
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
    <div class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Yeni Ekipman</h1>
            <div class="right-0 mr-10 absolute">
                <Button label="Kaydet" icon="pi pi-check" class="mb-4" severity="success" :loading="loading"
                    @click="confirmAddEquipment()" />
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputText id="equipmentName" v-model="equipmentName" class="w-full" />
                    <label for="equipmentName">Ekipman Adı</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="equipmentType" inputId="equipmentType"
                        :options="equipmentService.getEquipmentTypes()" optionLabel="label" class="w-full" />
                    <label for="equipmentType">Ekipman Tipi</label>
                </FloatLabel>
            </div>
        </div>
    </div>
</template>