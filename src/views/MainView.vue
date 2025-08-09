<script setup lang="ts">
import Menubar from '@/components/Menubar.vue';
import { RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue';

</script>

<template>
    <header>
        <div>
            <Menubar />
        </div>
        <div class="grid grid-flow-row md:grid-flow-col">
            <div class="m-3">
                <Menu></Menu>
            </div>
            <div class="col-span-18 m-5 md:mr-10">
                <RouterView />
            </div>
        </div>
    </header>

</template>
