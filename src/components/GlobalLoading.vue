<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

defineProps<{
    loading: boolean;
}>();
</script>

<template>
    <div v-if="loading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
        <div class="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".5s" />
            <span class="text-sm font-medium text-gray-600">Lütfen bekleyin...</span>
        </div>
    </div>
</template>
