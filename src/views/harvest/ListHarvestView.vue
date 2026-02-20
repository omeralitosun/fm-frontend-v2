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
    <div>
        <div>
            <Button label="Biçilen Ürün Ekle" icon="pi pi-plus" class="mb-4" severity="success"
                @click="$router.push('/harvest/create')" />
            <DataTable :value="getAllHarvestDto?.harvests" stripedRows :loading="loading">
                <Column field="field" :header="properties.t('field')">
                    <template #body="{ data }">
                        <a :href="`/field/${data.fieldId}`" class="text-emerald-500">{{
                            data.fieldName }}</a>
                    </template>
                </Column>
                <Column field="productTypeName" :header="properties.t('productName')"></Column>
                <Column field="date" :header="properties.t('date')">
                    <template #body="{ data }">
                        {{ Util.formatDate(data.date) }}
                    </template>
                </Column>
                <Column field="amount" :header="properties.t('amount')">
                    <template #body="{ data }">
                        {{ Util.formatQuantity(data.amount, Unit.getUnitByKey(data.unit)?.label) }}
                    </template>
                </Column>
                <Column class="w-29 !text-end" :header="properties.t('action')">
                    <template #body="{ data }" :loading="loading">
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded></Button>
                    </template>
                </Column>
            </DataTable>
            <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllHarvestDto?.totalElements || 0" :rowsPerPageOptions="[10, 20, 30]" />
        </div>
    </div>
</template>