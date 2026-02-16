<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ActionTaken } from "@/model/actiontaken/ActionTaken";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { IActionTakenService } from "@/service/IActionTakenService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import type { GetAllActionTakenDTO } from "@/model/dto/GetAllActionTakenDTO";

const actionTakenService: IActionTakenService = ServiceController.getActionTakenService();
const properties = useI18n();

const getAllActionTakenDto = ref<GetAllActionTakenDTO>();



const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps<{
    fieldId: number;
    seasonId: number | undefined;
}>();

onMounted(async () => {
    fetchActionTakens();
});

watch(() => props.seasonId, () => {
    fetchActionTakens();
});

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchActionTakens();
}

async function deleteEquipment(id: number) {
    loading.value = true;
    await actionTakenService.deleteActionTaken(id);
    fetchActionTakens();
    loading.value = false;
}

async function fetchActionTakens() {
    loading.value = true;
    if (props.fieldId && props.seasonId) {
        getAllActionTakenDto.value = await actionTakenService.getAllActionTakenByFieldAndSeason(props.fieldId, props.seasonId, page.value, rows.value);
    } else {
        getAllActionTakenDto.value = await actionTakenService.getAllActionTaken(page.value, rows.value);
    }
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
            deleteEquipment(id);
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
            <Button label="Yeni Aksiyon" icon="pi pi-plus" class="mb-4" severity="success"
                @click="$router.push('/action-taken/create')" />
            <DataTable :value="getAllActionTakenDto?.actionTakens" stripedRows :loading="loading">
                <Column field="field" :header="properties.t('field')">
                    <template #body="{ data }">
                        <a :href="`/field/${data.field.id}`" class="text-emerald-500">{{
                            data.field.name }}</a>
                    </template>
                </Column>
                <Column field="process" :header="properties.t('actionTakenType')"></Column>
                <Column field="cost" :header="properties.t('cost')">
                    <template #body="slotProps">
                        {{ Util.formatCurrency(slotProps.data.cost, 'tr') }}
                    </template>
                </Column>
                <Column field="date" :header="properties.t('date')">
                    <template #body="{ data }">
                        {{ Util.formatDate(data.date) }}
                    </template>
                </Column>
                <Column class="w-29 !text-end" :header="properties.t('action')">
                    <template #body="{ data }" :loading="loading">
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded></Button>
                    </template>
                </Column>
            </DataTable>
            <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllActionTakenDto?.totalElements" :rowsPerPageOptions="[10, 20, 30]" />
        </div>
    </div>
</template>