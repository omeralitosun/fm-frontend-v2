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
import type { IHarvestService } from '@/service/IHarvestService';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import { CreateProductType } from '@/model/producttype/CreateProductType';
import Dialog from 'primevue/dialog';
import { Util } from '@/common/Util';
import { Unit } from '@/constants/Unit';
import { CreateHarvest } from '@/model/harvest/CreateHarvest';
import { ErrorUtil } from '@/common/ErrorUtil';
import type { Season } from '@/model/season/Season';
import type { ISeasonService } from '@/service/ISeasonService';
import { Harvest } from '@/model/harvest/Harvest';
import type { Field } from '@/model/field/Field';
import type { IFieldService } from '@/service/IFieldService';

const loading = ref(false);
const visibleAddProductTypeDialog = ref(false);
const toast = useToast();
const $router = useRouter();

const seasonService: ISeasonService = ServiceController.getSeasonService();
const productTypeService: IProductTypeService = ServiceController.getProductTypeService();
const harvestService: IHarvestService = ServiceController.getHarvestService();
const fieldService: IFieldService = ServiceController.getFieldService();

const productTypes = ref<ProductType[]>([]);
const productType = ref<ProductType>();
const seasons = ref<Season[]>([]);
const season = ref<Season>();
const fields = ref<Field[]>([]);
const field = ref<Field>(); 
const productTypeName = ref<string>();
const harvest = new Harvest();

let fieldPage = 0;
let fieldRowSize = 5;
let fieldFilterValue = '';
let productTypeRowSize = 5;
let productTypeFilterValue = '';
let seasonPage = 0;
let seasonRowSize = 5;
let seasonFilterValue = '';

const unit = ref<Unit>();

onMounted(async () => {
    fetchProductTypes();
    fetchSeasons();
    fetchFields();
});

async function confirmAddHarvest() {
    loading.value = true;
    try {
        let createHarvest: CreateHarvest = new CreateHarvest();
        if (!season.value || !field.value || !productType.value || !harvest.amount || !harvest.date ) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Ürün tipi, sezon, tarla, miktar ve tarih zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        createHarvest.productTypeId = productType.value.id;
        createHarvest.amount = harvest.amount;
        createHarvest.date = harvest.date;
        createHarvest.seasonId = season.value?.id;
        createHarvest.fieldId = field.value?.id;
        createHarvest.comment = harvest.comment;

        try {
            const response = await harvestService.addHarvest(createHarvest);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün başarıyla eklendi.', life: 3000 });

            await $router.push('/harvest');
        } catch (error: any) {
            ErrorUtil.throwError(error.response);
        }
        
    } catch (error) {
        throw error;
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
    productTypes.value = (await productTypeService.getAllProductTypes(0, productTypeRowSize, productTypeFilterValue)).productTypes;
    loading.value = false;
};

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

async function onProductTypeScroll(event: { first: number; last: number; }) {
    if ((event.last % productTypeRowSize) === 0 && event.last >= productTypes.value.length) {
        const moreProductTypes = (await productTypeService.getAllProductTypes(event.last / productTypeRowSize, productTypeRowSize, productTypeFilterValue)).productTypes;
        productTypes.value = [...productTypes.value, ...moreProductTypes];
    }
}

async function onProductTypeFilter(event: { value: string; }) {
    productTypeFilterValue = event.value;

    loading.value = true;
    productTypes.value = (await productTypeService.getAllProductTypes(0, productTypeRowSize, productTypeFilterValue)).productTypes;
    loading.value = false;
}

async function createNewSeason() {
    const newSeason = await seasonService.createSeasonFromCurrentYearToNextYear();
    seasons.value.filter(season => season.id === newSeason.id).length === 0 ? seasons.value.push(newSeason) : null;
}

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
</script>

<template>
    <div class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Biçilen Ürün Ekleme</h1>
            <div class="right-0 mr-10 absolute">
                <Button label="Kaydet" icon="pi pi-check" class="mb-4" severity="success" :loading="loading"
                    @click="confirmAddHarvest()" />
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
                                    ({{ Util.formatQuantity(option.totalAmount) }} {{
                                        Unit.getUnitByKey(option.unit)?.label }})
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
                    <label for="equipment">Ürün Tipi</label>
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
                    <DatePicker id="maintenanceDate" v-model="harvest.date" class="w-full" showIcon
                        dateFormat="dd/mm/yy" />
                    <label for="maintenanceDate">Biçim Tarihi</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputNumber v-model="harvest.amount" mode="decimal" locale="tr-TR" :minFractionDigits="2"
                        :maxFractionDigits="2" :useGrouping="true" :suffix="productType?.unit
                            ? ` ${Unit.getUnitByKey(productType.unit)?.label}`
                            : ''" fluid />
                    <label>Miktar</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 md:mt-5">
                <FloatLabel variant="on">
                    <Textarea id="maintenanceComment" v-model="harvest.comment" rows="5" cols="50"
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