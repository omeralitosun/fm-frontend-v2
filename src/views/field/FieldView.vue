<script setup lang="ts">
import type { IFieldService } from "@/service/IFieldService";
import { ServiceController } from "@/service/ServiceController";
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Field } from '@/model/field/Field';
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { CreateField } from '@/model/field/CreateField';
import Select from 'primevue/select';
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Button from "primevue/button";
import ListActionTakenView from '../actiontaken/ListActionTakenView.vue';
import type { Season } from "@/model/season/Season";
import type { ISeasonService } from "@/service/ISeasonService";
import Chart from 'primevue/chart';
import { Process } from "@/constants/Process";
import type { GetAllSeasonDto } from "@/model/dto/GetAllSeasonDto";
import SummaryView from "../summary/SummaryView.vue";

const fieldService: IFieldService = ServiceController.getFieldService();
const seasonService: ISeasonService = ServiceController.getSeasonService();

const loading = ref(false);
const route = useRoute();
const router = useRouter();

const isEditable = ref(false);
const confirm = useConfirm();
const toast = useToast();
const id = ref();

const getAllSeasonDto = ref<GetAllSeasonDto>();
const season = ref<Season>();

const field = ref<Field>();

const chartData = ref();

const costPerDecare = ref<Map<string, number>>(new Map<string, number>());

onMounted(() => {
    id.value = route.params.id as string;
    fetchField(id.value);
    fetchSeasons()
    chartData.value = setChartData();
});

async function fetchField(id: string) {
    try {
        loading.value = true;
        field.value = await fieldService.getField(id);
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
    }
}

async function fetchSeasons() {
    loading.value = true;
    getAllSeasonDto.value = await seasonService.getAllSeasons(0, 10);
    loading.value = false;
};

function confirmEditField() {
    isEditable.value = !isEditable.value;
}

function confirmCancelEdit() {
    fetchField(id.value);
    isEditable.value = !isEditable.value;
}

async function createNewSeason() {
    const newSeason = await seasonService.createSeasonFromCurrentYearToNextYear();
    getAllSeasonDto.value?.seasons.filter(season => season.id === newSeason.id).length === 0 ? getAllSeasonDto.value.seasons.push(newSeason) : null;
}

async function deleteField(id: string) {
    loading.value = true;
    await fieldService.deleteField(id);
    loading.value = false;
}

function handleSeasonChange(event: any) {
    costPerDecare.value = new Map<string, number>();

    costPerDecare.value.set(Process.SOIL_PREPARATION.label, 1234);
    costPerDecare.value.set(Process.REAP.label, 2105);
    costPerDecare.value.set(Process.OTHER.label, 2000);
    costPerDecare.value.set(Process.PLANTING.label, 2000);
    chartData.value = setChartData();
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
            deleteField(id);
            toast.add({ severity: 'info', summary: 'Başarılı', detail: 'Kayıt silindi.', life: 3000, group: 'top-center' });
            router.push("/field");
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Iptal', detail: 'Iptal ettiniz.', life: 3000, group: 'top-center' });
        }
    });
};

const confirmUpdateField = (id: string) => {
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
            updateField(id);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ekipman başarıyla kaydedildi.', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Iptal', detail: 'Iptal ettiniz.', life: 3000, group: 'top-center' });
        }
    });
};

async function updateField(id: string) {
    loading.value = true;
    try {
        let createField: CreateField = new CreateField();
        if (!field.value?.name || !field.value?.decare) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Tarla Adı ve Dönüm zorunludur.', life: 1500, group: 'top-center' });
            return;
        }

        createField.name = field.value.name;
        createField.decare = field.value.decare;

        const response = await fieldService.updateField(id, createField);
    } catch (error) {
        console.error("Error adding Field:", error);
    } finally {
        isEditable.value = false;
        fetchField(id);
        loading.value = false;
    }
}

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        datasets: [
            {
                data: Array.from(costPerDecare.value.values()),
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-pink-500'),
                    documentStyle.getPropertyValue('--p-gray-500'),
                    documentStyle.getPropertyValue('--p-orange-500'),
                    documentStyle.getPropertyValue('--p-purple-500'),
                    documentStyle.getPropertyValue('--p-cyan-500'),
                    documentStyle.getPropertyValue('--p-teal-500')
                ],
                label: 'Dönüm Başına Maliyet (da/tl)'
            }
        ],
        labels: Array.from(costPerDecare.value.keys())
    };
};

</script>

<template>
    <div v-if="field" class="space-y-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <h1 class="text-2xl font-bold">Tarla Detay</h1>
            <div class="flex flex-wrap gap-2">
                <template v-if="!isEditable">
                    <Button label="Düzenle" icon="pi pi-pencil" severity="info" rounded
                        :loading="loading" @click="confirmEditField()" />
                    <Button label="Sil" icon="pi pi-trash" severity="danger" rounded
                        :loading="loading" @click="confirmDelete(id)" />
                </template>
                <template v-else>
                    <Button label="Kaydet" icon="pi pi-check" severity="success" rounded
                        :loading="loading" @click="confirmUpdateField(id)" />
                    <Button label="Vazgeç" icon="pi pi-times" severity="warn" rounded
                        :loading="loading" @click="confirmCancelEdit()" />
                </template>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputText id="fieldName" v-model='field.name' class="w-full"
                        :class="{ 'font-bold text-emerald-600 bg-emerald-50/50': !isEditable }" :disabled="!isEditable" />
                    <label for="fieldName">Tarla Adı</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputNumber id="fieldDecare" v-model='field.decare' class="w-full"
                        :class="{ 'font-bold text-emerald-600 bg-emerald-50/50': !isEditable }" :disabled="!isEditable" />
                    <label for="fieldDecare">Dönüm</label>
                </FloatLabel>
            </div>
        </div>

        <div v-if="!isEditable" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div class="lg:col-span-2 space-y-6">
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-600">
                    <span class="font-bold shrink-0">Sezon Seçimi:</span>
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <Select v-model="season" :options="getAllSeasonDto?.seasons" optionLabel="name"
                            placeholder="Sezon Seçin" class="w-full sm:w-48" @change="handleSeasonChange" />
                        <Button icon="pi pi-plus" severity="secondary" rounded text @click="createNewSeason()" />
                    </div>
                </div>

                <Accordion v-if="season" value="0">
                    <AccordionPanel value="0">
                        <AccordionHeader>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-list text-emerald-600"></i>
                                <span class="font-bold">Yapılan İşlemler</span>
                            </div>
                        </AccordionHeader>
                        <AccordionContent>
                            <div class="overflow-x-auto">
                                <ListActionTakenView :fieldId="id" :seasonId="season?.id" />
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                        <AccordionHeader>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-chart-bar text-emerald-600"></i>
                                <span class="font-bold">Sezon Özeti</span>
                            </div>
                        </AccordionHeader>
                        <AccordionContent>
                            <SummaryView :fieldId="id" :seasonId="season?.id" />
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </div>

            <div v-if="season" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                <h3 class="text-lg font-bold mb-6 w-full text-left text-gray-800">Maliyet Dağılımı</h3>
                <div class="w-full max-w-[300px]">
                    <Chart type="doughnut" :data="chartData" class="w-full" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.custom-green-text .p-dropdown-label {
    color: oklch(69.6% 0.17 162.48);
}
</style>