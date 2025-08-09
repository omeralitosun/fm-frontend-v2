import 'reflect-metadata';
import './assets/main.css';
import "primeicons/primeicons.css";


import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import i18n from './i18n';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {

        }
    }
});
app.use(i18n);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.mount('#app')

