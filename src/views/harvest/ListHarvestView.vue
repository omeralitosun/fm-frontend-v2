<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { IHarvestService } from "@/service/IHarvestService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import { Unit } from "@/constants/Unit";
import type { GetAllHarvestDTO } from "@/model/dto/GetAllHarvestDTO";

const harvestService: IHarvestService = ServiceController.getHarvestService();
const properties = useI18n();

const getAllHarvestDto = ref<GetAllHarvestDTO>();

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
    fetchHarvests();
});

const props = defineProps<{
    equipmentId: string;
}>();

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchHarvests();
}

async function deleteHarvest(id: number) {
    loading.value = true;
    await harvestService.deleteHarvest(id);
    fetchHarvests();
    loading.value = false;
}

async function fetchHarvests() {
    loading.value = true;
    getAllHarvestDto.value = (await harvestService.getAllHarvest(page.value, rows.value));
    loading.value = false;
};

const confirmDelete = (id: number) => {
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
            deleteHarvest(id);
            toast.add({ severity: 'info', summary: 'Başarılı', detail: 'Kayıt silindi.', life: 3000, group: 'top-center' });
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Iptal', detail: 'Iptal ettiniz.', life: 3000, group: 'top-center' });
        }
    });
};

</script>

<template>
    <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 class="text-2xl font-bold">{{ properties.t('new_harvest') }}</h1>
            <Button label="Biçilen Ürün Ekle" icon="pi pi-plus" severity="success" rounded
                @click="$router.push('/harvest/create')" />
        </div>

        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
            <DataTable :value="getAllHarvestDto?.harvests" stripedRows :loading="loading" class="p-datatable-sm">
                <Column field="field" :header="properties.t('field')">
                    <template #body="{ data }">
                        <a :href="`/field/${data.fieldId}`" class="text-emerald-600 font-medium hover:underline">
                            {{ data.fieldName }}
                        </a>
                    </template>
                </Column>
                <Column field="productTypeName" :header="properties.t('productName')"></Column>
                <Column field="date" :header="properties.t('date')">
                    <template #body="{ data }">
                        <span class="">
                            {{ Util.formatDate(data.date) }}
                        </span>
                    </template>
                </Column>
                <Column field="amount" :header="properties.t('amount')">
                    <template #body="{ data }">
                        <span class="font-semibold">
                            {{ Util.formatQuantity(data.amount) }}
                        </span>
                    </template>
                </Column>
                <Column class="w-32 !text-end" :header="properties.t('action')">
                    <template #body="{ data }" :loading="loading">
                        <div class="flex gap-2 justify-end">
                            <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)"
                                rounded size="small"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllHarvestDto?.totalElements"
            :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />
    </div>
</template>