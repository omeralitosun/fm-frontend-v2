<script setup lang="ts">
import MainView from './views/MainView.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import GlobalLoading from '@/components/GlobalLoading.vue';
import { useToast } from 'primevue/usetoast'
import { globalState } from '@/common/GlobalState';

window.$toast = useToast()

</script>

<template>
  <GlobalLoading :loading="globalState.loading" />
  <Toast />
  <Toast position="top-center" group="top-center" />
  <ConfirmDialog></ConfirmDialog>
  <MainView />
</template>

<style scoped></style>
