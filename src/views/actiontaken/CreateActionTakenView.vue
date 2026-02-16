<script setup lang="ts">
import { FloatLabel } from 'primevue';
import Select from 'primevue/select';
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import { Unit } from '@/constants/Unit';
import type { IFieldService } from '@/service/IFieldService';
import { Field } from '@/model/field/Field';
import { CreateActionTaken } from '@/model/actiontaken/CreateActionTaken';
import type { IActionTakenService } from '@/service/IActionTakenService';
import { ErrorUtil } from '@/common/ErrorUtil';
import type { ISeasonService } from '@/service/ISeasonService';
import { Season } from '@/model/season/Season';
import { CreateUsedProduct } from '@/model/usedproduct/CreateUsedProduct';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import InputNumber from 'primevue/inputnumber';
import type { ProductType } from '@/model/producttype/ProductType';
import type { IProductTypeService } from '@/service/IProductTypeService';
import { Util } from '@/common/Util';
import { Process } from '@/constants/Process';

const loading = ref(false);
const toast = useToast();
const $router = useRouter();

const seasonService: ISeasonService = ServiceController.getSeasonService();
const actionTakenService: IActionTakenService = ServiceController.getActionTakenService();
const fieldService: IFieldService = ServiceController.getFieldService();
const productTypeService: IProductTypeService = ServiceController.getProductTypeService();

const seasons = ref<Season[]>([]);
const fields = ref<Field[]>([]);
const field = ref<Field>();
const season = ref<Season>();
const productTypes = ref<ProductType[]>([]);
const productType = ref<ProductType>();
const usedProductAmount = ref<number>();
const process = ref<Process>();

const createActionTaken = new CreateActionTaken();
const createUsedProducts = ref<CreateUsedProduct[]>([]);

let fieldPage = 0;
let fieldRowSize = 5;
let fieldFilterValue = '';
let seasonPage = 0;
let seasonRowSize = 5;
let seasonFilterValue = '';
let productTypePage = 0;
let productTypeRowSize = 5;
let productTypeFilterValue = '';

const unit = ref<Unit>();

onMounted(async () => {
    fetchFields();
    fetchSeasons();
    fetchProductTypes();
});

async function confirmAddActionTaken() {
    loading.value = true;
    try {
        if (!season.value || !field.value || !process.value || !createActionTaken.date || ((createActionTaken.cost === undefined || createActionTaken.cost < 0) && createUsedProducts.value.length === 0)) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Sezon, tarla, tarih zorunludur. Diğer maliyet veya en az bir kullanılan ürün zorunludur.', life: 1500, group: 'top-center' });
            return;
        }

        createActionTaken.seasonId = season.value.id;
        createActionTaken.fieldId = field.value.id;
        createActionTaken.process = process.value.key;
        createActionTaken.usedProducts = createUsedProducts.value;

        await actionTakenService.addActionTaken(createActionTaken);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Alınan aksiyon başarıyla eklendi.', life: 3000 });

        await $router.push('/action-taken/');
    } catch (error) {
        ErrorUtil.throwError(error);
    } finally {
        loading.value = false;
    }

}

async function fetchSeasons() {
    loading.value = true;
    seasons.value = (await seasonService.getAllSeasons(seasonPage, seasonRowSize)).seasons;
    loading.value = false;
};

async function fetchFields() {
    loading.value = true;
    fields.value = (await fieldService.getAllField(fieldPage, fieldRowSize)).fields;
    loading.value = false;
};

async function onSeasonScroll(event: { first: number; last: number; }) {
    if ((event.last % seasonRowSize) === 0 && event.last >= seasons.value.length) {
        const moreSeasons = await seasonService.getAllSeasons(event.last / seasonRowSize, seasonRowSize);
        seasons.value = [...seasons.value, ...moreSeasons.seasons];
    }
}
async function onSeasonFilter(event: { value: string; }) {

}

async function onFieldScroll(event: { first: number; last: number; }) {
    if ((event.last % fieldRowSize) === 0 && event.last >= fields.value.length) {
        const moreFields = await fieldService.getAllField(event.last / fieldRowSize, fieldRowSize);
        fields.value = [...fields.value, ...moreFields.fields];
    }
}

async function onFieldFilter(event: { value: string; }) {
    // Implement field filtering logic here if needed
}

async function createNewSeason() {
    const newSeason = await seasonService.createSeasonFromCurrentYearToNextYear();
    seasons.value.filter(season => season.id === newSeason.id).length === 0 ? seasons.value.push(newSeason) : null;
}

async function fetchProductTypes() {
    loading.value = true;
    productTypes.value = (await productTypeService.getAllProductTypes(productTypePage, productTypeRowSize, productTypeFilterValue)).productTypes;
    loading.value = false;
};

async function onProductTypeScroll(event: { first: number; last: number; }) {
    if ((event.last % productTypeRowSize) === 0 && event.last >= productTypes.value.length) {
        const moreProductTypes = (await productTypeService.getAllProductTypes(event.last / productTypeRowSize, productTypeRowSize, productTypeFilterValue)).productTypes;
        productTypes.value = [...productTypes.value, ...moreProductTypes];
    }

}
async function onProductTypeFilter(event: { value: string; }) {
    productTypeFilterValue = event.value;
    fetchProductTypes();
    console.log(productTypes.value);
}

function removeUsedProductFromList(usedProduct: CreateUsedProduct) {
    const productTypeToRemove = productTypes.value.find(pt => pt.id === usedProduct.productTypeId);
    if (productTypeToRemove) {
        productTypeToRemove.totalAmount += usedProduct.amount;
    }
    createUsedProducts.value = createUsedProducts.value.filter(up => up !== usedProduct);
}

function addUsedProductToList() {
    if (!productType.value || !usedProductAmount.value) {
        toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ürün tipi ve miktar zorunludur', life: 1500, group: 'top-center' });
        return;
    }
    if (productType.value.totalAmount < usedProductAmount.value) {
        toast.add({ severity: 'warn', summary: 'Yetersiz Miktar', detail: 'Kullanmak istediğiniz miktar mevcut miktardan fazla olamaz', life: 1500, group: 'top-center' });
        return;
    }

    let newUsedProduct = new CreateUsedProduct();
    newUsedProduct.productTypeId = productType.value?.id!;
    newUsedProduct.productTypeName = productType.value?.name!;
    newUsedProduct.amount = usedProductAmount.value!;

    createUsedProducts.value.forEach(up => {
        if (up.productTypeId === newUsedProduct.productTypeId) {
            up.amount += newUsedProduct.amount;
            newUsedProduct = undefined!;
        }
    });

    if (newUsedProduct) {
        createUsedProducts.value.push(newUsedProduct);
    }

    productType.value.totalAmount -= usedProductAmount.value;
    productType.value = undefined;
    usedProductAmount.value = undefined;
}

</script>

<template>
    <div class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Tarla İşlemleri Ekleme</h1>
            <div class="right-0 mr-10 absolute">
                <Button label="Kaydet" icon="pi pi-check" class="mb-4" severity="success" :loading="loading"
                    @click="confirmAddActionTaken()" />
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6 mb">
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="field" inputId="field" :options="fields" class="w-full" optionLabel="name"
                        :virtualScrollerOptions="{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: onFieldScroll
                        }" :filter="true" filterPlaceholder="Tarla ara..." @filter="onFieldFilter">

                        <template #footer>
                            <div class="p-3">
                                <Button label="Tarla Ekle" fluid severity="secondary" variant="text" size="small"
                                    icon="pi pi-plus" @click="$router.push('/field/create')" />
                            </div>
                        </template>
                    </Select>
                    <label for="field">Tarla</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="season" inputId="season" :options="seasons" class="w-full" optionLabel="name"
                        :virtualScrollerOptions="{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: onSeasonScroll
                        }" :filter="true" filterPlaceholder="Sezon ara..." @filter="onSeasonFilter">

                        <template #footer>
                            <div class="p-3">
                                <Button label="Yeni Sezon" fluid severity="secondary" variant="text" size="small"
                                    icon="pi pi-plus" @click="createNewSeason()" />
                            </div>
                        </template>
                    </Select>
                    <label for="season">Sezon</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <Select v-model="process" inputId="process" :options="Process.values()" optionLabel="label"
                        class="w-full" />
                    <label for="process">İşlem Tipi</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <DatePicker id="actionTakenDate" v-model="createActionTaken.date" class="w-full" showIcon
                        dateFormat="dd/mm/yy" />
                    <label for="actionTakenDate">İşlem Tarihi</label>
                </FloatLabel>
            </div>
        </div>
        <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputNumber v-model="createActionTaken.cost" inputId="currency-us" mode="currency" currency="TRY"
                        locale="en-TR" fluid />
                    <label for="actionTakenCost">Diğer Maliyet</label>
                </FloatLabel>
            </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 md:mt-5">
                <FloatLabel variant="on">
                    <Textarea id="actionTakenComment" v-model="createActionTaken.comment" rows="5" cols="50"
                        style="resize: none" />
                    <label for="actionTakenComment">Not</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid md:grid-cols-6 mt-10">
            <div class="md:col-span-5 bg-zinc-800 p-3">

                <Accordion value="0">
                    <AccordionPanel value="Kullanılan Ürünler" key="usedProducts">
                        <AccordionHeader>Kullanılan Ürünler</AccordionHeader>
                        <AccordionContent>
                            <DataTable :value="createUsedProducts" stripedRows :loading="loading">
                                <Column field="productTypeName" header="Kullanılan Ürün">
                                    <template #body="{ data }">
                                        {{ data.productTypeName }}
                                    </template>
                                    <template #footer>
                                        <FloatLabel variant="on">
                                            <Select v-model="productType" inputId="productType" :options="productTypes"
                                                class="w-full" :virtualScrollerOptions="{
                                                    itemSize: 38,
                                                    lazy: true,
                                                    onLazyLoad: onProductTypeScroll
                                                }" :filter="true" filterPlaceholder="Ürün ara..."
                                                @filter="onProductTypeFilter">
                                                <template #value="{ value }">
                                                    <span v-if="value">
                                                        {{ value.name }} ({{ value.totalAmount }})
                                                    </span>
                                                </template>
                                                <template #option="{ option }">
                                                    <div class="flex justify-between w-full">
                                                        <span>{{ option.name }}</span>
                                                        <span class="text-sm text-gray-500">
                                                            ({{ Util.formatQuantity(option.totalAmount) }} {{
                                                                Unit.getUnitByKey(option.unit)?.label }})
                                                        </span>
                                                    </div>
                                                </template>
                                            </Select>
                                            <label for="productType">Kullanılan Ürün</label>
                                        </FloatLabel>
                                    </template>

                                </Column>
                                <Column field="quantity" header="Miktar">
                                    <template #body="{ data }">
                                        {{ Util.formatQuantity(data.amount, Unit.getUnitByKey(data.unit)?.label) }}
                                    </template>
                                    <template #footer>
                                        <FloatLabel variant="on">
                                            <InputNumber v-model="usedProductAmount" mode="decimal" locale="tr-TR"
                                                :minFractionDigits="2" :maxFractionDigits="2" :useGrouping="true"
                                                :suffix="productType?.unit
                                                    ? ` ${Unit.getUnitByKey(productType.unit)?.label}`
                                                    : ''" fluid />
                                            <label>Miktar</label>
                                        </FloatLabel>
                                    </template>
                                </Column>
                                <Column field="action" header="Aksiyon">
                                    <template #footer>
                                        <Button icon="pi pi-plus" severity="success"
                                            @click="addUsedProductToList()"></Button>
                                    </template>
                                    <template #body="{ data }" :loading="loading">
                                        <Button icon="pi pi-trash" severity="danger"
                                            @click="removeUsedProductFromList(data)" rounded></Button>
                                    </template>
                                </Column>
                            </DataTable>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

            </div>
        </div>

    </div>
</template>