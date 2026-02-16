<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SelledProduct } from '@/model/selledproduct/SelledProduct';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { ISelledProductService } from "@/service/ISelledProductService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import { Unit } from "@/constants/Unit";

const SelledProductService: ISelledProductService = ServiceController.getSelledProductService();
const properties = useI18n();

const selledproduct = ref<SelledProduct[]>([]);

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
    fetchSelledProducts();
});

const props = defineProps<{
    equipmentId: string;
}>();

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchSelledProducts();
}

async function deleteSelledProduct(id: string) {
    loading.value = true;
    await SelledProductService.deleteSelledProduct(id);
    fetchSelledProducts();
    loading.value = false;
}

async function fetchSelledProducts() {
    loading.value = true;
    selledproduct.value = await SelledProductService.getAllSelledProduct(page.value, rows.value);
    loading.value = false;
};

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
            deleteSelledProduct(id);
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
            <Button label="Satılan Ürün Ekle" icon="pi pi-plus" class="mb-4" severity="success"
                @click="$router.push('/selled-product/create')" />
            <DataTable :value="selledproduct" stripedRows :loading="loading">
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
                <Column field="unitPrice" :header="properties.t('unitPrice')">
                    <template #body="{ data }">
                        {{ Util.formatCurrency(data.unitPrice, 'tr') }}
                    </template>
                </Column>
                <Column field="totalPrice" :header="properties.t('totalPrice')">
                    <template #body="{ data }">
                        {{ Util.formatCurrency(data.unitPrice * data.amount, 'tr') }}
                    </template>
                </Column>
            </DataTable>
            <Paginator :rows="rows" @page="onPageChange" :totalRecords="150" :rowsPerPageOptions="[10, 20, 30]" />
        </div>
    </div>
</template>