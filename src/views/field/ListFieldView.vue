<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import type { IFieldService } from "@/service/IFieldService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { GetAllFieldDTO } from "@/model/dto/GetAllFieldDTO";

const fieldService: IFieldService = ServiceController.getFieldService();
const properties = useI18n();

const getAllFieldDto = ref<GetAllFieldDTO>();

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
  fetchFields();
});

async function onPageChange(event: any) {
  page.value = event.page;
  rows.value = event.rows;
  fetchFields();
}

async function deleteField(id: string) {
  loading.value = true;
  await fieldService.deleteField(id);
  fetchFields();
  loading.value = false;
}

async function fetchFields() {
  loading.value = true;
  getAllFieldDto.value = await fieldService.getAllField(page.value, rows.value);
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
      deleteField(id);
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
      <h1 class="text-2xl font-bold">{{ properties.t('field') }}</h1>
      <Button :label="properties.t('new_field')" icon="pi pi-plus" severity="success" rounded
        @click="$router.push('/field/create')" />
    </div>

    <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
      <DataTable :value="getAllFieldDto?.fields" stripedRows :loading="loading" class="p-datatable-sm">
        <Column field="name" :header="properties.t('field')">
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </Column>
        <Column field="decare" :header="properties.t('fieldDecare')">
          <template #body="{ data }">
            <span class="font-semibold">{{ data.decare }} <span class="text-xs font-normal">Dönüm</span></span>
          </template>
        </Column>
        <Column class="w-32 !text-end" :header="properties.t('action')">
          <template #body="{ data }" :loading="loading">
            <div class="flex gap-2 justify-end">
              <Button icon="pi pi-search" severity="info" @click="$router.push('/field/' + data.id)" rounded size="small"></Button>
              <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded size="small"></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllFieldDto?.totalElements || 0" :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />
  </div>
</template>