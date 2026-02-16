<script setup lang="ts">
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import type { IFieldService } from "@/service/IFieldService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { ref } from 'vue';
import { CreateField } from '@/model/field/CreateField';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";

const fieldService: IFieldService = ServiceController.getFieldService();
const loading = ref(false);
const $router = useRouter();
const toast = useToast();

const fieldName = ref<string>();
const fieldDecare = ref<number>();

async function confirmAddField() {
    loading.value = true;
    try {
        let createField: CreateField = new CreateField();
        if (!fieldName.value || !fieldDecare.value) {
            toast.add({ severity: 'warn', summary: 'Zorunlu', detail: 'Tarla adı ve dekarı zorunludur', life: 1500, group: 'top-center' });
            return;
        }

        createField.name = fieldName.value;
        createField.decare = fieldDecare.value;

        const response = await fieldService.addField(createField);
        
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Tarla başarıyla eklendi.', life: 3000 });

        await $router.push('/field/' + response.data.id);
    } catch (error) {
        console.error("Error adding Field:", error);
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="w-full md:m-20">
        <div class="flex mb-10">
            <h1 class="text-xl">Yeni Tarla</h1>
            <div class="right-0 mr-10 absolute">
                <Button label="Kaydet" icon="pi pi-check" class="mb-4" severity="success" :loading="loading"
                    @click="confirmAddField()" />
            </div>
        </div>
        <div class="grid grid-flow-row md:grid-cols-6">
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputText id="fieldName" v-model="fieldName" class="w-full" />
                    <label for="fieldName">Tarla Adı</label>
                </FloatLabel>
            </div>
            <div class="w-full md:w-52 mb-5">
                <FloatLabel variant="on">
                    <InputNumber id="fieldDecare" v-model="fieldDecare" class="w-full" :maxFractionDigits="1" :minFractionDigits="1" :min="0"/>
                    <label for="fieldDecare">Dönüm</label>
                </FloatLabel>
            </div>
        </div>
    </div>
</template>