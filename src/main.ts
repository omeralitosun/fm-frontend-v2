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
import DialogService from 'primevue/dialogservice';
import Toast from 'primevue/toast'

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
app.component('Toast', Toast);

app.config.errorHandler = (err, vm, info) => {
    errorHandler(err);
}

app.mount('#app')

import { useToast } from 'primevue/usetoast'
import { BusinessError } from './errors/BusinessError';
import { AppError } from './errors/AppError';
import { ErrorUtil } from './common/ErrorUtil';

declare global {
    interface Window {
        $toast: ReturnType<typeof useToast>
    }
}

window.addEventListener('unhandledrejection', (event) => {
    const err = event.reason;
    errorHandler(err);
});

const errorHandler = (err: any) => {
    console.error('Global Error Handler:', err);
    if(!(err instanceof AppError)) {
        err = ErrorUtil.createError(err);
    }

    if (err instanceof BusinessError) {
        window.$toast?.add({
            severity: 'error',
            summary: err.statusLabel || 'Business Error',
            detail: err.message,
            life: 4000
        })

        if (err.redirectTo) {
            router.push(err.redirectTo)
        }
    } else {
        router.push('/error-page')
    }
}