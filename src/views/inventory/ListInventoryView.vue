<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { InputText } from "primevue";
import Paginator from 'primevue/paginator';
import type { IProductTypeService } from "@/service/IProductTypeService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import { Unit } from "@/constants/Unit";
import { GetAllProductTypeDTO } from "@/model/dto/GetAllProductTypeDTO";

const ProductTypeService: IProductTypeService = ServiceController.getProductTypeService();
const properties = useI18n();

const getAllProductTypeDTO = ref<GetAllProductTypeDTO>();

const rows = ref(10);
const page = ref(0);
let productTypeFilterValue = '';

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
    fetchProductTypes();
});

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchProductTypes();
}

async function fetchProductTypes() {
    loading.value = true;
    getAllProductTypeDTO.value = await ProductTypeService.getAllProductTypes(page.value, rows.value, productTypeFilterValue);
    loading.value = false;
};

</script>

<template>
    <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 class="text-2xl font-bold">{{ properties.t('inventory') || 'Envanter' }}</h1>
            <div class="w-full sm:w-64">
                <InputText v-model="productTypeFilterValue" :placeholder="properties.t('Ürün Ara')" class="w-full" @input="fetchProductTypes" />
            </div>
        </div>

        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
            <DataTable :value="getAllProductTypeDTO?.productTypes" stripedRows :loading="loading" class="p-datatable-sm">
                <Column field="name" header="Ürün">
                    <template #body="{ data }">
                        <span class="font-medium">{{ data.name }}</span>
                    </template>
                </Column>
                <Column field="amount" :header="properties.t('amount')">
                    <template #body="{ data }">
                        <span class="font-semibold">
                            {{ Util.formatQuantity(data.totalAmount, Unit.getUnitByKey(data.unit)?.label) }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllProductTypeDTO?.totalElements || 0"
            :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />
    </div>
</template>