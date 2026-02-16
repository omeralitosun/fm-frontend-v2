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
    <div>
        <div>
            <InputText v-model="productTypeFilterValue" :placeholder="properties.t('Ürün Ara')" class="mb-4" @input="fetchProductTypes" />
            <DataTable :value="getAllProductTypeDTO?.productTypes" stripedRows :loading="loading">
                <Column field="name" header="Ürün"></Column>
                <Column field="amount" :header="properties.t('amount')">
                    <template #body="{ data }">
                        {{ Util.formatQuantity(data.totalAmount, Unit.getUnitByKey(data.unit)?.label) }}
                    </template>
                </Column>
            </DataTable>
            <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllProductTypeDTO?.totalElements || 0"
                :rowsPerPageOptions="[10, 20, 30]" />
        </div>
    </div>
</template>