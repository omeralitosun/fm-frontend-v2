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
    <div v-if="field" class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Tarla Detay</h1>
            <div class="right-0 mr-10 absolute">
                <Button v-if="!isEditable" label="Düzenle" icon="pi pi-pencil" class="mb-4 ml-2" severity="info"
                    :loading="loading" @click="confirmEditField()" />
                <Button v-if="!isEditable" label="Sil" icon="pi pi-trash" class="mb-4 ml-2" severity="danger"
                    :loading="loading" @click="confirmDelete(id)" />
                <Button v-if="isEditable" label="Kaydet" icon="pi pi-check" class="mb-4 ml-2" severity="success"
                    :loading="loading" @click="confirmUpdateField(id)" />
                <Button v-if="isEditable" label="Vazgeç" icon="pi pi-times" class="mb-4 ml-2" severity="warn"
                    :loading="loading" @click="confirmCancelEdit()" />
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 mb-5 ">
                <FloatLabel variant="on">
                    <InputText id="fieldName" v-model='field.name' class="w-full"
                        :style="{ color: !isEditable ? 'oklch(69.6% 0.17 162.48)' : '' }" :disabled="!isEditable" />
                    <label for="fieldName">Tarla Adı</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputText v-if="!isEditable" id="fieldDecare" v-model="(field.decare as unknown as string)"
                        class="w-full" style="color: oklch(69.6% 0.17 162.48);" :disabled="!isEditable" />
                    <InputNumber v-if="isEditable" id="fieldDecare" v-model="field.decare" class="w-full"
                        :maxFractionDigits="1" :minFractionDigits="1" :min="0" />
                    <label for="fieldDecare">Dönüm</label>
                </FloatLabel>
            </div>
        </div>
        <div v-if="!isEditable" class="grid md:grid-cols-6 mt-10">
            <div class="md:col-span-5 bg-zinc-800 p-3 rounded-xl">
                <div class="w-full md:w-52 mb-5 ">
                    <FloatLabel variant="on">
                        <Select v-model="season" inputId="equipment" :options="getAllSeasonDto?.seasons"
                            optionLabel="name" class="w-full" @change="handleSeasonChange">
                            <template #footer>
                                <div class="p-3">
                                    <Button label="Yeni Sezon" fluid severity="secondary" variant="text" size="small"
                                        icon="pi pi-plus" @click="createNewSeason()" />
                                </div>
                            </template>
                        </Select>
                        <label for="equipment">Sezon</label>
                    </FloatLabel>
                </div>
                <div v-if="season" class="grid mt-10">
                    <div class="md:col-span-2">
                        <Accordion value="0">
                            <AccordionPanel value="Alınan Aksiyon" key="actionTaken">
                                <AccordionHeader>Özet</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col md:flex-row gap-4 mb">
                                        <!-- Şimdilik kapalı, ileride açılabilir
                                        <div class="w-full md:flex-1">
                                            <Chart type="polarArea" :data="chartData"
                                                class="w-full bg-amber-50" />
                                        </div>
                                        -->
                                        <div class="w-full md:flex-2">
                                            <SummaryView :fieldId="id" :seasonId="season?.id" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                    </div>
                </div>
                <div v-if="season" class="grid mt-10">
                    <div class="md:col-span-5">
                        <Accordion value="0">
                            <AccordionPanel value="Alınan Aksiyon" key="actionTaken">
                                <AccordionHeader>Alınan Aksiyon</AccordionHeader>
                                <AccordionContent>
                                    <ListActionTakenView :fieldId="id" :seasonId="season?.id" />
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                    </div>
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