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
    <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 class="text-2xl font-bold">{{ properties.t('maintenanceType') }}</h1>
            <Button label="Yeni Ekipman Bakımı" icon="pi pi-plus" severity="success" rounded
                @click="$router.push('/maintenance/create')" />
        </div>

        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
            <DataTable :value="getAllMaintenanceDto?.maintenances" stripedRows :loading="loading" class="p-datatable-sm">
                <Column field="equipment" :header="properties.t('equipment')">
                    <template #body="{ data }">
                        <a :href="`/equipment/${data.equipment.id}`" class="text-emerald-600 font-medium hover:underline">
                            {{ data.equipment.name }}
                        </a>
                    </template>
                </Column>
                <Column field="maintenanceType" :header="properties.t('maintenanceType')"></Column>
                <Column field="cost" :header="properties.t('cost')">
                    <template #body="slotProps">
                        <span class="font-semibold">
                            {{ Util.formatCurrency(slotProps.data.cost, 'tr') }}
                        </span>
                    </template>
                </Column>
                <Column field="date" :header="properties.t('date')">
                    <template #body="{ data }">
                        <span class="">
                            {{ Util.formatDate(data.date) }}
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

        <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllMaintenanceDto?.totalElements"
            :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />
    </div>
</template>