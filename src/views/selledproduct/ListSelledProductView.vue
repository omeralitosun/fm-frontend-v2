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
import type { GetAllSelledProductsDto } from "@/model/dto/GetAllSelledProductsDTO";

const SelledProductService: ISelledProductService = ServiceController.getSelledProductService();
const properties = useI18n();

const getAllSelledProductsDto = ref<GetAllSelledProductsDto>();

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

async function deleteSelledProduct(id: number) {
    loading.value = true;
    await SelledProductService.deleteSelledProduct(id);
    fetchSelledProducts();
    loading.value = false;
}

async function fetchSelledProducts() {
    loading.value = true;
    getAllSelledProductsDto.value = await SelledProductService.getAllSelledProduct(page.value, rows.value);
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
    <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 class="text-2xl font-bold">{{ properties.t('new_selled_product') }}</h1>
            <Button label="Satılan Ürün Ekle" icon="pi pi-plus" severity="success" rounded
                @click="$router.push('/selled-product/create')" />
        </div>

        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
            <DataTable :value="getAllSelledProductsDto?.selledProducts" stripedRows :loading="loading" class="p-datatable-sm">
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
                <Column field="totalPrice" :header="properties.t('totalPrice')">
                    <template #body="{ data }">
                        <span class="font-semibold text-primary-600">
                            {{ Util.formatCurrency(data.unitPrice * data.amount, 'tr') }}
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

        <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllSelledProductsDto?.totalElements || 0"
            :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />
    </div>
</template>