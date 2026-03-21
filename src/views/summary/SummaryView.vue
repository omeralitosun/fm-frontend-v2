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
    <div class="space-y-8">
        <div v-if="summary" class="space-y-8">
            <!-- İşlemler Bölümü -->
            <section>
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-cog text-emerald-600 font-bold"></i>
                    <h2 class="text-xl font-bold">Yapılan İşlemler</h2>
                </div>
                <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table class="w-full border-collapse bg-white">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-100">
                                <th class="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Maliyet (TL/da)</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="action in summary.actionTakens" :key="action.process" class="hover:bg-gray-50/50 transition-colors">
                                <td class="p-4 text-sm font-medium text-gray-700">{{ action.process }}</td>
                                <td class="p-4 text-sm text-right text-gray-600 font-mono">{{ Util.formatCurrency(action.costPerDecare, 'tr') }}</td>
                                <td class="p-4 text-sm text-right font-bold text-emerald-700">{{ Util.formatCurrency(action.totalCost, 'tr') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Hasatlar Bölümü -->
            <section>
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-box text-emerald-600 font-bold"></i>
                    <h2 class="text-xl font-bold">Hasatlar</h2>
                </div>
                <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table class="w-full border-collapse bg-white text-sm">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-100">
                                <th class="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Verim (kg/da)</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Gelir (TL/da)</th>
                                <th class="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam Gelir</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="harvest in summary.harvests" :key="harvest.productName" class="hover:bg-gray-50/50 transition-colors">
                                <td class="p-4 font-bold text-gray-800">{{ harvest.productName }}</td>
                                <td class="p-4 text-right text-gray-600">{{ Util.formatQuantity(harvest.totalAmount) }}</td>
                                <td class="p-4 text-right text-gray-600 font-semibold">{{ Util.formatQuantity(harvest.amountPerDecare) }}</td>
                                <td class="p-4 text-right text-gray-600">{{ Util.formatCurrency(harvest.averageUnitPrice, 'tr') }}</td>
                                <td class="p-4 text-right text-gray-600 italic">{{ Util.formatCurrency(harvest.averageUnitPrice * harvest.amountPerDecare, 'tr') }}</td>
                                <td class="p-4 text-right font-bold text-emerald-700">{{ Util.formatCurrency(harvest.totalIncome, 'tr') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
        <div v-else class="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-500 font-medium text-center">Bu sezon için henüz veri bulunmamaktadır.</p>
        </div>
    </div>
</template>