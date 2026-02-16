<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Maintenance } from '@/model/maintenance/Maintenance';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { IMaintenanceService } from "@/service/IMaintenanceService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import type { GetAllMaintenanceDTO } from "@/model/dto/GetAllMaintenanceDTO";

const maintenanceService: IMaintenanceService = ServiceController.getMaintenanceService();
const properties = useI18n();

const getAllMaintenanceDto = ref<GetAllMaintenanceDTO>();

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
    fetchEquipments();
});

const props = defineProps<{
    equipmentId: string;
}>();

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchEquipments();
}

async function deleteEquipment(id: string) {
    loading.value = true;
    await maintenanceService.deleteMaintenance(id);
    fetchEquipments();
    loading.value = false;
}

async function fetchEquipments() {
    loading.value = true;
    if (props.equipmentId) {
        getAllMaintenanceDto.value = await maintenanceService.getAllMaintenanceByEquipmentId(props.equipmentId, page.value, rows.value);
    } else {
        getAllMaintenanceDto.value = await maintenanceService.getAllMaintenance(page.value, rows.value);
    }
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
            <Button label="Yeni Ekipman Bakımı" icon="pi pi-plus" class="mb-4" severity="success"
                @click="$router.push('/maintenance/create')" />
            <DataTable :value="getAllMaintenanceDto?.maintenances" stripedRows :loading="loading">
                <Column field="equipment" :header="properties.t('equipment')">
                    <template #body="{ data }">
                        <a :href="`/equipment/${data.equipment.id}`" class="text-emerald-500">{{
                            data.equipment.name }}</a>
                    </template>
                </Column>
                <Column field="maintenanceType" :header="properties.t('maintenanceType')"></Column>
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
            <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllMaintenanceDto?.totalElements || 0" :rowsPerPageOptions="[10, 20, 30]" />
        </div>
    </div>
</template>