<script setup lang="ts">
import { Util } from '@/common/Util';
import { GetSummmaryByFieldAndSeasonDTO } from '@/model/dto/GetSummaryByFieldAndSeasonDTO';
import type { ISummaryService } from '@/service/ISummaryService';
import { ServiceController } from '@/service/ServiceController';
import { onMounted, ref, watch } from 'vue';



const props = defineProps<{
    fieldId: number;
    seasonId: number | undefined;
}>();


onMounted(async () => {
    fetchSummary();
});

watch(() => props.seasonId, () => {
    fetchSummary();
});

const summaryService: ISummaryService = ServiceController.getSummaryService();

const summary = ref<GetSummmaryByFieldAndSeasonDTO>();

async function fetchSummary() {
    if (props.fieldId && props.seasonId) {
        summary.value = await summaryService.getSummaryByFieldAndSeason(props.fieldId, props.seasonId);
    }
}
</script>

<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Özet</h1>
        <div v-if="summary">
            <h2 class="text-xl font-semibold mb-2">Yapılan İşlemler</h2>
            <table class="w-full border-collapse mb-6">
                <thead>
                    <tr>
                        <th class="border p-2 text-left">İşlem</th>
                        <th class="border p-2 text-right">Dekar Başına Maliyet (TL/da)</th>
                        <th class="border p-2 text-right">Toplam Maliyet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="action in summary.actionTakens">
                        <td class="border p-2">{{ action.process }}</td>
                        <td class="border p-2 text-right">{{ Util.formatCurrency(action.costPerDecare, 'tr') }} </td>
                        <td class="border p-2 text-right">{{  Util.formatCurrency(action.totalCost, 'tr') }} TL</td>
                    </tr>
                </tbody>
            </table>

            <h2 class="text-xl font-semibold mb-2">Hasatlar</h2>
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border p-2 text-left">Ürün Türü</th>
                        <th class="border p-2 text-right">Toplam Miktar (kg)</th>
                        <th class="border p-2 text-right">Dekar Başına Miktar (kg/da)</th>
                        <th class="border p-2 text-right">Ortalama Birim Fiyat (TL/kg)</th>
                        <th class="border p-2 text-right">Dekar Başına Gelir (TL/da)</th>
                        <th class="border p-2 text-right">Tahmini Toplam Gelir (TL)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="harvest in summary.harvests">
                        <td class="border p-2">{{ harvest.productName }}</td>
                        <td class="border p-2 text-right">{{ Util.formatQuantity(harvest.totalAmount) }}</td>
                        <td class="border p-2 text-right">{{ Util.formatQuantity(harvest.amountPerDecare) }}</td>
                        <td class="border p-2 text-right">{{ Util.formatCurrency(harvest.averageUnitPrice, 'tr') }}</td>
                        <td class="border p-2 text-right">{{ Util.formatCurrency(harvest.averageUnitPrice * harvest.amountPerDecare, 'tr') }}</td>
                        <td class="border p-2 text-right">{{ Util.formatCurrency(harvest.totalIncome, 'tr') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>