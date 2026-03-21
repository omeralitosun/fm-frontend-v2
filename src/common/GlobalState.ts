import { reactive } from 'vue';

export const globalState = reactive({
    loading: false,
    setLoading(value: boolean) {
        this.loading = value;
    }
});
