<script setup lang="ts">

import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Menu from '../components/Menu.vue';

const products = ref();



const items2 = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/about/test'
  },
  {
    label: 'Features',
    icon: 'pi pi-star'
  },
]);
</script>

<template>
  <div class="">
    <Menu></Menu>
    <div class="">
      <div>
        <DataTable :value="products" stripedRows tableStyle="min-width: 50rem">
          <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity" #body="slotProps"> test {{ slotProps.data.id }}</Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style></style>
