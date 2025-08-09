<script setup lang="ts">
import Menubar from 'primevue/menubar';
import { RouterLink } from 'vue-router'
import { ref } from "vue";
import { useI18n } from 'vue-i18n';

const properties = useI18n();

const items = ref([
    {
        label: properties.t('homepage'),
        route: '/'
    }
]);

</script>

<template>
    <header>
        <div>
            <Menubar :model="items" class="h-15">
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" v-bind="props.action"
                        custom>
                        <a v-ripple :href="href" @click="navigate">
                            <span>{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else v-ripple :href="item.url" v-bind="props.action">
                        <span>{{ item.label }}</span>
                    </a>
                </template>
            </Menubar>
        </div>
    </header>

</template>
