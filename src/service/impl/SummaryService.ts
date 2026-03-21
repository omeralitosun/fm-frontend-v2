import { Service } from "typedi";
import api from "../api";
import type { ISummaryService } from "../ISummaryService";
import { GetSummmaryByFieldAndSeasonDTO } from "@/model/dto/GetSummaryByFieldAndSeasonDTO";
import { GetActionTakenWithoutDetailDTO } from "@/model/dto/GetActionTakenWithoutDetailDTO";
import { Process } from "@/constants/Process";
import { GetHarvestWithoutDetailDTO } from "@/model/dto/GetHarvestWithoutDetailDTO";

@Service()
export class SummaryService implements ISummaryService {
    private readonly apiSummaryURL = "/api/v1/summary";

    async getSummaryByFieldAndSeason(fieldId: number, seasonId: number): Promise<GetSummmaryByFieldAndSeasonDTO> {
        const response = await api.get(`${this.apiSummaryURL}/field/${fieldId}/season/${seasonId}`);
        return this.mapToGetSummaryByFieldAndSeasonDTO(response.data);
    }

    private mapToGetSummaryByFieldAndSeasonDTO(data: any): GetSummmaryByFieldAndSeasonDTO {
        const summary = new GetSummmaryByFieldAndSeasonDTO();

        summary.actionTakens = data.actionTakens.map((item: any) => {
            const actionTaken = new GetActionTakenWithoutDetailDTO();
            const process = Process.getProcessByKey(item.process);
            actionTaken.process = process ? process.label : item.process;
            actionTaken.costPerDecare = item.costPerDecare;
            actionTaken.totalCost = item.totalCost;
            return actionTaken;
        });

        summary.harvests = data.harvests.map((item: any) => {
            const harvest = new GetHarvestWithoutDetailDTO();
            harvest.productName = item.productType.name;
            harvest.amountPerDecare = item.amountPerDecare;
            harvest.averageUnitPrice = item.averageUnitPrice;
            harvest.totalAmount = item.totalAmount;
            harvest.totalIncome = item.totalIncome;
            return harvest;
        });

        return summary;
    }
}