<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ActionTaken } from "@/model/actiontaken/ActionTaken";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import Popover from 'primevue/popover';
import type { IActionTakenService } from "@/service/IActionTakenService";
import type { IUsedProductService } from "@/service/IUsedProductService";
import { ServiceController } from "@/service/ServiceController";
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Util } from "@/common/Util";
import type { GetAllActionTakenDTO } from "@/model/dto/GetAllActionTakenDTO";
import type { GetAllUsedProductsDTO } from "@/model/dto/GetAllUsedProductDTO";

const actionTakenService: IActionTakenService = ServiceController.getActionTakenService();
const usedProductService: IUsedProductService = ServiceController.getUsedProductService();
const properties = useI18n();

const getAllActionTakenDto = ref<GetAllActionTakenDTO>();
const usedProductsDto = ref<GetAllUsedProductsDTO>();
const showUsedProductsDialog = ref(false);
const selectedActionTakenId = ref<number>();
const op = ref();
const selectedComment = ref('');

const toggle = (event: any, comment: string) => {
    selectedComment.value = comment;
    op.value.toggle(event);
};

const rows = ref(10);
const page = ref(0);

const loading = ref(false);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps<{
    fieldId: number;
    seasonId: number | undefined;
}>();

onMounted(async () => {
    fetchActionTakens();
});

watch(() => props.seasonId, () => {
    fetchActionTakens();
});

async function onPageChange(event: any) {
    page.value = event.page;
    rows.value = event.rows;
    fetchActionTakens();
}

async function deleteEquipment(id: number) {
    loading.value = true;
    await actionTakenService.deleteActionTaken(id);
    fetchActionTakens();
    loading.value = false;
}

async function fetchActionTakens() {
    loading.value = true;
    if (props.fieldId && props.seasonId) {
        getAllActionTakenDto.value = await actionTakenService.getAllActionTakenByFieldAndSeason(props.fieldId, props.seasonId, page.value, rows.value);
    } else {
        getAllActionTakenDto.value = await actionTakenService.getAllActionTaken(page.value, rows.value);
    }
    loading.value = false;
};

async function viewUsedProducts(actionTakenId: number) {
    selectedActionTakenId.value = actionTakenId;
    loading.value = true;
    try {
        usedProductsDto.value = await usedProductService.getAllUsedProductsByActionTakenId(actionTakenId, 0, 100);
        showUsedProductsDialog.value = true;
    } finally {
        loading.value = false;
    }
}

const confirmDelete = (id: number) => {
    confirm.require({
        message: properties.t('delete_confirm_message'),
        header: properties.t('delete_confirm_title'),
        icon: 'pi pi-info-circle',
        rejectLabel: properties.t('cancel'),
        rejectProps: {
            label: properties.t('cancel'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: properties.t('delete'),
            severity: 'danger'
        },
        accept: () => {
            deleteEquipment(id);
            toast.add({ severity: 'info', summary: properties.t('success'), detail: properties.t('delete_success'), life: 3000, group: 'top-center' });
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: properties.t('warning'), detail: properties.t('cancel'), life: 3000, group: 'top-center' });
        }
    });
};

</script>

<template>
    <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 class="text-2xl font-bold">{{ properties.t('actionTakenType') }}</h1>
            <Button :label="properties.t('new_action')" icon="pi pi-plus" severity="success" rounded
                @click="$router.push('/action-taken/create')" />
        </div>

        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-100 bg-white">
            <DataTable :value="getAllActionTakenDto?.actionTakens" stripedRows :loading="loading"
                class="p-datatable-sm">
                <Column field="field" :header="properties.t('field')">
                    <template #body="{ data }">
                        <a :href="`/field/${data.field.id}`" class="text-emerald-600 font-medium hover:underline">
                            {{ data.field.name }}
                        </a>
                    </template>
                </Column>
                <Column field="process" :header="properties.t('actionTakenType')"></Column>
                <Column field="cost" :header="properties.t('cost')">
                    <template #body="slotProps">
                        <span class="font-semibold">
                            {{ Util.formatCurrency(slotProps.data.cost, 'tr') }}
                        </span>
                    </template>
                </Column>
                <Column field="date" :header="properties.t('date')">
                    <template #body="{ data }">
                        <span>
                            {{ Util.formatDate(data.date) }}
                        </span>
                    </template>
                </Column>
                <Column field="comment" :header="properties.t('comment')">
                    <template #body="{ data }">
                        <span v-if="data.comment" v-tooltip.top="data.comment"
                            class="cursor-pointer"
                            @click="toggle($event, data.comment)">
                            {{ Util.truncate(data.comment, 5) }}
                        </span>
                    </template>
                </Column>
                <Column class="w-32 !text-end" :header="properties.t('action')">
                    <template #body="{ data }" :loading="loading">
                        <div class="flex gap-2 justify-end">
                            <Button icon="pi pi-box" severity="info" @click="viewUsedProducts(data.id)" rounded
                                :title="properties.t('view_used_products')" size="small"></Button>
                            <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data.id)" rounded
                                size="small"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Paginator :rows="rows" @page="onPageChange" :totalRecords="getAllActionTakenDto?.totalElements"
            :rowsPerPageOptions="[10, 20, 30]" class="mt-4" />

        <Dialog v-model:visible="showUsedProductsDialog" modal :header="properties.t('used_products')"
            :style="{ width: '90vw', maxWidth: '600px' }" class="p-fluid">
            <DataTable :value="usedProductsDto?.usedProducts" stripedRows class="p-datatable-sm">
                <Column field="productTypeName" :header="properties.t('productName')"></Column>
                <Column field="amount" :header="properties.t('amount')">
                    <template #body="{ data }">
                        {{ Util.formatQuantity(data.amount) }}
                    </template>
                </Column>
                <Column field="unitPrice" :header="properties.t('unitPrice')">
                    <template #body="{ data }">
                        {{ Util.formatCurrency(data.unitPrice, 'tr') }}
                    </template>
                </Column>
                <Column :header="properties.t('totalPrice')">
                    <template #body="{ data }">
                        <span class="font-bold">
                            {{ Util.formatCurrency(data.amount * data.unitPrice, 'tr') }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </Dialog>

        <Popover ref="op">
            <div class="p-4 rounded-xl shadow-xl border border-gray-100 max-w-[300px]">
                <div class="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                    <div class="p-2 bg-blue-50 rounded-lg">
                        <i class="pi pi-info-circle text-blue-600"></i>
                    </div>
                    <span class="font-bold">{{ properties.t('comment') }}</span>
                </div>
                <p class="text-sm leading-relaxed whitespace-pre-wrap italic">
                    "{{ selectedComment }}"
                </p>
            </div>
        </Popover>
    </div>
</template>