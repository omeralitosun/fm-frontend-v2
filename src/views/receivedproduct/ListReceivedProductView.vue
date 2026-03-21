<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { IReceivedProductService } from "@/service/IReceivedProductService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import { Unit } from "@/constants/Unit";
import { GetAllReceivedProductDTO } from "@/model/dto/GetAllReceivedProductDTO";
import { ErrorUtil } from '@/common/ErrorUtil';

const receivedProductService: IReceivedProductService = ServiceController.getReceivedProductService();
const properties = useI18n();

const getAllReceivedProductDTO = ref<GetAllReceivedProductDTO>();

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
    fetchReceivedProducts();
});

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchReceivedProducts();
}

async function deleteReceivedProduct(id: string) {
    loading.value = true;
    try {
        await receivedProductService.deleteReceivedProduct(id);
        await fetchReceivedProducts();
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kayıt silindi.', life: 3000, group: 'top-center' });
    } catch (error: any) {
        ErrorUtil.throwError(error.response);
    } finally {
        loading.value = false;
    }
}

async function fetchReceivedProducts() {
    loading.value = true;
    getAllReceivedProductDTO.value = await receivedProductService.getAllReceivedProduct(page.value, rows.value);
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
        accept: async () => {
            await deleteReceivedProduct(id);
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Iptal', detail: 'Iptal ettiniz.', life: 3000, group: 'top-center' });
        }
    });
    ;
}

</script>

<template>
    <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 class="text-2xl font-bold">{{ properties.t('new_received_product') }}</h1>
            <Button label="Alınan Ürün Ekle" icon="pi pi-plus" severity="success" rounded
                @click="$router.push('/received-product/create')" />
        </div>

        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
            <DataTable :value="getAllReceivedProductDTO?.receivedProducts" stripedRows :loading="loading"
                class="p-datatable-sm">
                <Column field="productTypeName" :header="properties.t('productName')">
                    <template #body="{ data }">
                        <span class="font-medium">{{ data.productTypeName }}</span>
                    </template>
                </Column>
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
                            {{ Util.formatQuantity(data.amount, Unit.getUnitByKey(data.unit)?.label) }}
                        </span>
                    </template>
                </Column>
                <Column field="unitPrice" :header="properties.t('unitPrice')">
                    <template #body="{ data }">
                        {{ Util.formatCurrency(data.unitPrice, 'tr') }}
                    </template>
                </Column>
                <Column class="w-32 !text-end" :header="properties.t('action')">
                    <template #body="{ data }" :loading="loading">
                        <div class="flex gap-2 justify-end">
                            <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded
                                size="small"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllReceivedProductDTO?.totalElements || 0"
            :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />
    </div>
</template>