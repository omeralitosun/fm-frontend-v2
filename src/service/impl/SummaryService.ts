import { Service } from "typedi";
import type { ISelledProductService } from "../ISelledProductService";
import axios from "axios";
import { CreateSelledProduct } from "@/model/selledproduct/CreateSelledProduct";
import type { AxiosResponse } from "axios";
import { SelledProduct } from "@/model/selledproduct/SelledProduct";
import type { ISummaryService } from "../ISummaryService";
import { GetSummmaryByFieldAndSeasonDTO } from "@/model/dto/GetSummaryByFieldAndSeasonDTO";
import { GetActionTakenWithoutDetailDTO } from "@/model/dto/GetActionTakenWithoutDetailDTO";
import { Process } from "@/constants/Process";
import { GetHarvestWithoutDetailDTO } from "@/model/dto/GetHarvestWithoutDetailDTO";
import { ProductType } from "@/model/producttype/ProductType";

@Service()
export class SummaryService implements ISummaryService {

    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiSelledProductURL = this.apiUrl + "/api/v1/selledProduct"

    async getSummaryByFieldAndSeason(fieldId: number, seasonId: number): Promise<GetSummmaryByFieldAndSeasonDTO> {

        const pathVariable = this.apiUrl + "/api/v1/summary/field/" + fieldId + "/season/" + seasonId;
        const response = await axios.get(pathVariable);

        const getSummary = new GetSummmaryByFieldAndSeasonDTO();

        console.log("Summary response: ", response.data);

        getSummary.actionTakens = response.data.actionTakens.map((item: any) => {
            const actionTaken = new GetActionTakenWithoutDetailDTO();

            const process = Process.getProcessByKey(item.process);
            if (process) {
                actionTaken.process = process.label;
            }

            actionTaken.costPerDecare = item.costPerDecare;
            actionTaken.totalCost = item.totalCost;

            return actionTaken;
        });

        getSummary.harvests = response.data.harvests.map((item: any) => {
            const harvest = new GetHarvestWithoutDetailDTO();
            
            harvest.productName = item.productType.name;
            harvest.amountPerDecare = item.amountPerDecare;
            harvest.averageUnitPrice = item.averageUnitPrice;
            harvest.totalAmount = item.totalAmount;
            harvest.totalIncome = item.totalIncome;

            return harvest;
        });


        return getSummary;
    }
}