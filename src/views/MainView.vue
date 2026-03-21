<script setup lang="ts">
import Menubar from '@/components/Menubar.vue';
import { RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue';

</script>

<template>
    <header class="min-h-screen">
        <div class="sticky top-0 z-50 shadow-sm">
            <Menubar />
        </div>
        <div class="flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
            <aside class="w-full md:w-64 p-4 md:p-6 shrink-0">
                <Menu />
            </aside>
            <main class="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                <div class="max-w-7xl mx-auto rounded-xl shadow-sm p-4 md:p-8 min-h-[500px]">
                    <RouterView />
                </div>
            </main>
        </div>
    </header>
</template>
