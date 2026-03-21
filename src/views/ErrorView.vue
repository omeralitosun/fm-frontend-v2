<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
    <div class="p-5 bg-white rounded-full shadow-md mb-6">
        <i class="pi pi-exclamation-triangle text-5xl text-red-500"></i>
    </div>
    <h1 class="text-3xl font-bold text-red-800 mb-4 leading-tight">Beklenmedik Hata</h1>
    <p class="text-lg text-red-600 max-w-md mx-auto mb-8 leading-relaxed">
      Üzgünüz, bir sorun oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
    </p>
    <Button label="Ana Sayfaya Dön" icon="pi pi-home" severity="danger" rounded @click="$router.push('/')" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
</script>