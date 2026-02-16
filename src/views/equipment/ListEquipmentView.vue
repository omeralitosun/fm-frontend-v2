<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Equipment } from '@/model/equipment/Equipment';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { IEquipmentService } from "@/service/IEquipmentService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { GetAllEquipmentDTO } from "@/model/dto/GetAllEquipmentDTO";

const equipmentService: IEquipmentService = ServiceController.getEquipmentService();
const properties = useI18n();

const getAllEquipmentDto = ref<GetAllEquipmentDTO>();

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
  fetchEquipments();
});

async function onPageChange(event: any) {
  page.value = event.page;
  rows.value = event.rows;
  fetchEquipments();
}

async function deleteEquipment(id: string) {
  loading.value = true;
  await equipmentService.deleteEquipment(id);
  fetchEquipments();
  loading.value = false;
}

async function fetchEquipments() {
  loading.value = true;
  getAllEquipmentDto.value = await equipmentService.getAllEquipment(page.value, rows.value);
  console.log(getAllEquipmentDto.value);
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
    <div class="">
      <Button label="Yeni Ekipman" icon="pi pi-plus" class="mb-4" severity="success"
        @click="$router.push('/equipment/create')" />
      <DataTable :value="getAllEquipmentDto?.equipments" stripedRows :loading="loading">
        <Column field="name" :header="properties.t('equipment')"></Column>
        <Column field="equipmentType" :header="properties.t('equipmentType')"></Column>
        <Column class="w-29 !text-end" :header="properties.t('action')">
          <template #body="{ data }" :loading="loading">
            <Button icon="pi pi-search" severity="info" @click="$router.push('/equipment/' + data.id)" rounded></Button>
            <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded></Button>
          </template>
        </Column>
      </DataTable>
      <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllEquipmentDto?.totalElements" :rowsPerPageOptions="[10, 20, 30]" />
    </div>
  </div>
</template>