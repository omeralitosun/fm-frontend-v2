<script setup lang="ts">
import MegaMenu from 'primevue/megamenu';
import { MenuUtil } from '@/common/MenuUtil';

const items = MenuUtil.getMenuItems();

</script>
<template>
    
    <MegaMenu :model="items" orientation="vertical">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" v-bind="props.action" custom>
                <a v-ripple :href="href" @click="navigate">
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else v-ripple :href="item.url" v-bind="props.action">
                <span>{{ item.label }}</span>
            </a>
        </template>
    </MegaMenu>
    
</template>