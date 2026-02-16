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
  <div>
    <div class="">
      <Button label="Yeni Tarla" icon="pi pi-plus" class="mb-4" severity="success"
        @click="$router.push('/field/create')" /> 
      <DataTable :value="getAllFieldDto?.fields" stripedRows :loading="loading">
        <Column field="name" :header="properties.t('field')"></Column>
        <Column field="decare" :header="properties.t('fieldDecare')"></Column>
        <Column class="w-29 !text-end" :header="properties.t('action')">
          <template #body="{ data }" :loading="loading">
            <Button icon="pi pi-search" severity="info" @click="$router.push('/field/' + data.id)" rounded></Button>
            <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded></Button>
          </template>
        </Column>
      </DataTable>
      <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllFieldDto?.totalElements || 0" :rowsPerPageOptions="[10, 20, 30]" />
    </div>
  </div>
</template>