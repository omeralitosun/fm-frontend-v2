<script setup lang="ts">
import MainView from './views/MainView.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast'

window.$toast = useToast()

</script>

<template>
  <Toast />
  <Toast position="top-center" group="top-center" />
  <ConfirmDialog></ConfirmDialog>
  <MainView />
</template>

<style scoped></style>
