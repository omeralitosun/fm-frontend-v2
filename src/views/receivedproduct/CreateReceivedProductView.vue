<script setup lang="ts">
import { FloatLabel } from 'primevue';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import type { IProductTypeService } from "@/service/IProductTypeService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { ProductType } from '@/model/producttype/ProductType';
import type { IReceivedProductService } from '@/service/IReceivedProductService';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import { CreateProductType } from '@/model/producttype/CreateProductType';
import Dialog from 'primevue/dialog';
import { Util } from '@/common/Util';
import { Unit } from '@/constants/Unit';
import { CreateReceivedProduct } from '@/model/receivedproduct/CreateReceivedProduct';
import { ReceivedProduct } from '@/model/receivedproduct/ReceivedProduct';

const loading = ref(false);
const visibleAddProductTypeDialog = ref(false);
const toast = useToast();
const $router = useRouter();

const productTypeService: IProductTypeService = ServiceController.getProductTypeService();
const receivedProductService: IReceivedProductService = ServiceController.getReceivedProductService();

const productTypes = ref<ProductType[]>([]);
const productType = ref<ProductType>();
const productTypeName = ref<string>();
const receivedProduct = new ReceivedProduct();

let page = 0;
let rowSize = 5;
let productTypeFilterValue = '';

const unit = ref<Unit>();

onMounted(async () => {
    fetchProductTypes();
});

async function confirmAddReceivedProduct() {
    loading.value = true;
    try {
        let createReceivedProduct: CreateReceivedProduct = new CreateReceivedProduct();
        if (!productType.value || !receivedProduct.amount || !receivedProduct.unitPrice || !receivedProduct.date) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ürün tipi, miktar, birim fiyat ve tarih zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        createReceivedProduct.productTypeId = productType.value.id;
        createReceivedProduct.amount = receivedProduct.amount;
        createReceivedProduct.unitPrice = receivedProduct.unitPrice;
        createReceivedProduct.date = receivedProduct.date;

        const response = await receivedProductService.addReceivedProduct(createReceivedProduct);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Alınan ürün başarıyla eklendi.', life: 3000 });

        await $router.push('/received-product/');
    } catch (error) {
        console.error("Error adding received product:", error);
    } finally {
        loading.value = false;
    }

}

async function confirmAddProductType() {
    loading.value = true;
    try {
        let createProductType: CreateProductType = new CreateProductType();
        if (!productTypeName.value || !unit.value) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ürün tipi adı ve birim zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        createProductType.name = productTypeName.value;
        createProductType.unit = unit.value.key;

        const response = await productTypeService.addProductType(createProductType);
        console.log(response.data);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün tipi başarıyla eklendi.', life: 3000 });
        visibleAddProductTypeDialog.value = false;
        const productTypeAdded = new ProductType();
        productTypeAdded.id = response.data.id;
        productTypeAdded.name = response.data.name;
        productTypeAdded.unit = response.data.unit;
        productTypeAdded.totalAmount = response.data.totalAmount;

        productTypes.value.push(productTypeAdded);
        productType.value = productTypeAdded;
    } catch (error) {
        console.error("Error adding product type:", error);
    } finally {
        loading.value = false;
    }
}

async function fetchProductTypes() {
    loading.value = true;
    productTypes.value = await productTypeService.getAllProductTypes(page, rowSize, productTypeFilterValue);
    loading.value = false;
};

async function onProductTypeScroll(event: { first: number; last: number; }) {
    if ((event.last % rowSize) === 0 && event.last >= productTypes.value.length) {
        const moreProductTypes = await productTypeService.getAllProductTypes(event.last / rowSize, rowSize, productTypeFilterValue);
        productTypes.value = [...productTypes.value, ...moreProductTypes];
    }

}
async function onProductTypeFilter(event: { value: string; }) {
    productTypeFilterValue = event.value;
    fetchProductTypes();
    console.log(productTypes.value);
}
</script>

<template>
    <div class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Alınan Ürün Ekleme</h1>
            <div class="right-0 mr-10 absolute">
                <Button label="Kaydet" icon="pi pi-check" class="mb-4" severity="success" :loading="loading"
                    @click="confirmAddReceivedProduct()" />
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6 mb">
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="productType" inputId="productType" :options="productTypes" class="w-full"
                        :virtualScrollerOptions="{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: onProductTypeScroll
                        }" :filter="true" filterPlaceholder="Ürün ara..." @filter="onProductTypeFilter">
                        <template #value="{ value }">
                            <span v-if="value">
                                {{ value.name }} ({{ value.totalAmount }})
                            </span>
                        </template>
                        <template #option="{ option }">
                            <div class="flex justify-between w-full">
                                <span>{{ option.name }}</span>
                                <span class="text-sm text-gray-500">
                                    ({{ Util.formatQuantity(option.totalAmount) }} {{ Unit.getUnitByKey(option.unit)?.label }})
                                </span>
                            </div>
                        </template>
                        <template #footer>
                            <div class="p-3">
                                <Button label="Ürün Tipi Ekle" fluid severity="secondary" variant="text" size="small"
                                    icon="pi pi-plus" @click="visibleAddProductTypeDialog = true" />
                            </div>
                        </template>
                    </Select>
                    <label for="productType">Ürün Tipi</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <DatePicker id="maintenanceDate" v-model="receivedProduct.date" class="w-full" showIcon
                        dateFormat="dd/mm/yy" />
                    <label for="maintenanceDate">Alım Tarihi</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputNumber v-model="receivedProduct.amount" mode="decimal" locale="tr-TR" :minFractionDigits="2"
                        :maxFractionDigits="2" :useGrouping="true" :suffix="productType?.unit
                            ? ` ${Unit.getUnitByKey(productType.unit)?.label}`
                            : ''" fluid />
                    <label>Miktar</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputNumber v-model="receivedProduct.unitPrice" inputId="currency-us" mode="currency"
                        currency="TRY" locale="en-TR" fluid />
                    <label for="maintenanceDate">Birim Fiyatı</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 md:mt-5">
                <FloatLabel variant="on">
                    <Textarea id="maintenanceComment" v-model="receivedProduct.comment" rows="5" cols="50"
                        style="resize: none" />
                    <label for="maintenanceComment">Not</label>
                </FloatLabel>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visibleAddProductTypeDialog" header="Yeni Ürün Tipi" :style="{ width: '25rem' }">
        <div class="w-full md:w-52 mb-5">
            <FloatLabel variant="on">
                <InputText id="productTypeName" v-model="productTypeName" class="w-full" />
                <label for="productTypeName">Ürün Tipi Adı</label>
            </FloatLabel>
        </div>
        <div class="w-full md:w-52 mb-5">
            <FloatLabel variant="on">
                <Select v-model="unit" inputId="unit" :options="Util.getUnits()" optionLabel="label" class="w-full" />
                <label for="unit">Birim</label>
            </FloatLabel>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="İptal" severity="secondary"
                @click="visibleAddProductTypeDialog = false"></Button>
            <Button type="button" label="Kaydet" @click="confirmAddProductType()"></Button>
        </div>
    </Dialog>
</template>