<script setup lang="ts">
import type { IEquipmentService } from "@/service/IEquipmentService";
import { ServiceController } from "@/service/ServiceController";
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Equipment } from '@/model/equipment/Equipment';
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { EquipmentType } from '@/constants/EquipmentType';
import Select from 'primevue/select';
import ListMaintenanceView from "../maintenance/ListMaintenanceView.vue";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

const equipmentService: IEquipmentService = ServiceController.getEquipmentService();

const loading = ref(false);
const route = useRoute();
const router = useRouter();

const isEditable = ref(false);
const confirm = useConfirm();
const toast = useToast();
const id = ref();
const equipmentType = ref<EquipmentType>();

const equipment = ref<Equipment>();
onMounted(() => {
    id.value = route.params.id as string;
    fetchEquipment(id.value);
});

async function fetchEquipment(id: string) {
    try {
        loading.value = true;
        equipment.value = await equipmentService.getEquipment(id); // ← await eklendi

        equipmentType.value = EquipmentType.getEquipmentTypeByKey(equipment.value.equipmentType);

        if (equipmentType.value) {
            equipment.value.equipmentType = equipmentType.value.label;
        }
    } catch (error) {

    } finally {
        loading.value = false;
    }
}

function confirmEditEquipment() {
    isEditable.value = !isEditable.value;
}

function confirmCancelEdit() {
    fetchEquipment(id.value);
    isEditable.value = !isEditable.value;
}

async function deleteEquipment(id: string) {
    loading.value = true;
    await equipmentService.deleteEquipment(id);
    loading.value = false;
}

const confirmDelete = (id: string) => {
    confirm.require({
        message: 'Silmek istediğinize emin misiniz? Bu işlem geri alinamaz!',
        header: 'Dikkat!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Iptal',
        rejectProps: {
            label: 'Iptal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sil',
            severity: 'danger'
        },
        accept: () => {
            deleteEquipment(id);
            toast.add({ severity: 'info', summary: 'Başarılı', detail: 'Kayıt silindi.', life: 3000, group: 'top-center' });
            router.push("/equipment");
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Iptal', detail: 'Iptal ettiniz.', life: 3000, group: 'top-center' });
        }
    });
};

const confirmUpdateEquipment = (id: string) => {
    confirm.require({
        message: 'Güncellemek istediğinize emin misiniz? Bu işlem geri alinamaz!',
        header: 'Dikkat!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Iptal',
        rejectProps: {
            label: 'Iptal',
            severity: 'danger'
        },
        acceptProps: {
            label: 'Güncelle',
            severity: 'success'
        },
        accept: () => {
            updateEquipment(id);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ekipman başarıyla kaydedildi.', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Iptal', detail: 'Iptal ettiniz.', life: 3000, group: 'top-center' });
        }
    });
};

async function updateEquipment(id: string) {
    loading.value = true;
    try {
        if (!equipment.value?.name || !equipmentType.value) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ekipman adı ve tipi zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        equipment.value.name = equipment.value.name;
        equipment.value.equipmentType = equipmentType.value.key;

        const response = await equipmentService.updateEquipment(id, equipment.value);
    } catch (error) {
        console.error("Error adding equipment:", error);
    } finally {
        isEditable.value = false;
        fetchEquipment(id);
        loading.value = false;
    }
}
</script>

<template>
    <div v-if="equipment" class="space-y-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <h1 class="text-2xl font-bold">Ekipman Detay</h1>
            <div class="flex flex-wrap gap-2">
                <template v-if="!isEditable">
                    <Button label="Düzenle" icon="pi pi-pencil" severity="info" rounded :loading="loading"
                        @click="confirmEditEquipment()" />
                    <Button label="Sil" icon="pi pi-trash" severity="danger" rounded :loading="loading"
                        @click="confirmDelete(id)" />
                </template>
                <template v-else>
                    <Button label="Kaydet" icon="pi pi-check" severity="success" rounded :loading="loading"
                        @click="confirmUpdateEquipment(id)" />
                    <Button label="Vazgeç" icon="pi pi-times" severity="warn" rounded :loading="loading"
                        @click="confirmCancelEdit()" />
                </template>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputText id="equipmentName" v-model='equipment.name' class="w-full"
                        :class="{ 'font-bold text-emerald-600 bg-emerald-50/50': !isEditable }"
                        :disabled="!isEditable" />
                    <label for="equipmentName">Ekipman Adı</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputText v-if="!isEditable" id="equipmentType" v-model='equipment.equipmentType'
                        class="w-full font-bold text-emerald-600 bg-emerald-50/50" :disabled="!isEditable" />
                    <Select v-if="isEditable" v-model="equipmentType" inputId="equipmentType"
                        :options="equipmentService.getEquipmentTypes()" optionLabel="label" class="w-full" />
                    <label for="equipmentType">Ekipman Tipi</label>
                </FloatLabel>
            </div>
        </div>

        <div class="mt-12">
            <Accordion value="0">
                <AccordionPanel value="0">
                    <AccordionHeader>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-wrench text-emerald-600"></i>
                            <span class="font-bold">Bakım Geçmişi</span>
                        </div>
                    </AccordionHeader>
                    <AccordionContent>
                        <div class="overflow-x-auto">
                            <ListMaintenanceView :equipmentId="id" />
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </div>
</template>

<style>
.custom-green-text .p-dropdown-label {
    color: oklch(69.6% 0.17 162.48);
}
</style>