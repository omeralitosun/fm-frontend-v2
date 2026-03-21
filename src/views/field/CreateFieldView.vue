<script setup lang="ts">
import { FloatLabel } from 'primevue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import type { IFieldService } from "@/service/IFieldService";
import { ServiceController } from "@/service/ServiceController";
import Button from 'primevue/button';
import { CreateField } from '@/model/field/CreateField';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const fieldService: IFieldService = ServiceController.getFieldService();
const $router = useRouter();
const toast = useToast();
const properties = useI18n();

const schema = yup.object({
    fieldName: yup.string().required(properties.t('required')),
    fieldDecare: yup.number().required(properties.t('required')).min(0.1)
});

const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const [fieldName] = defineField('fieldName');
const [fieldDecare] = defineField('fieldDecare');

const confirmAddField = handleSubmit(async (values) => {
    try {
        const createField = new CreateField();
        createField.name = values.fieldName;
        createField.decare = values.fieldDecare;

        const response = await fieldService.addField(createField);
        
        toast.add({ severity: 'success', summary: properties.t('success'), detail: properties.t('add_success'), life: 3000 });

        await $router.push('/field/' + response.data.id);
    } catch (error) {
        console.error("Error adding Field:", error);
    }
});

</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
            <h1 class="text-2xl font-bold">{{ properties.t('new_field') }}</h1>
            <Button :label="properties.t('save')" icon="pi pi-check" severity="success" rounded
                @click="confirmAddField()" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputText id="fieldName" v-model="fieldName" class="w-full" :invalid="!!errors.fieldName" />
                    <label for="fieldName">{{ properties.t('field') }}</label>
                </FloatLabel>
                <small class="text-red-500">{{ errors.fieldName }}</small>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel variant="on">
                    <InputNumber id="fieldDecare" v-model="fieldDecare" class="w-full" :maxFractionDigits="1" :minFractionDigits="1" :min="0" :invalid="!!errors.fieldDecare" />
                    <label for="fieldDecare">{{ properties.t('fieldDecare') }}</label>
                </FloatLabel>
                <small class="text-red-500">{{ errors.fieldDecare }}</small>
            </div>
        </div>
    </div>
</template>