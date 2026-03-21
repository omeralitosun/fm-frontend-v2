import { Service } from "typedi";
import type { IHarvestService } from "../IHarvestService";
import api from "../api";
import { CreateHarvest } from "@/model/harvest/CreateHarvest";
import { GetAllHarvestDTO } from "@/model/dto/GetAllHarvestDTO";
import { Harvest } from "@/model/harvest/Harvest";

@Service()
export class HarvestService implements IHarvestService {
    private readonly apiHarvestURL = "/api/v1/harvest";

    async addHarvest(harvest: CreateHarvest) {
        return await api.post(this.apiHarvestURL, harvest);
    }

    async getAllHarvest(page: number, rows: number): Promise<GetAllHarvestDTO> {
        const response = await api.get(this.apiHarvestURL, {
            params: { page, rows }
        });
        return this.mapToGetAllHarvestDTO(response.data);
    }

    async deleteHarvest(id: number): Promise<void> {
        await api.delete(`${this.apiHarvestURL}/${id}`);
    }

    private mapToGetAllHarvestDTO(data: any): GetAllHarvestDTO {
        const dto = new GetAllHarvestDTO();
        dto.totalElements = data.totalElements;
        dto.harvests = data.harvests.map((item: any) => this.mapToHarvest(item));
        return dto;
    }

    private mapToHarvest(item: any): Harvest {
        const harvest = new Harvest();
        harvest.id = item.id;
        harvest.fieldId = item.field.id;
        harvest.fieldName = item.field.name;
        harvest.productTypeName = item.productType.name;
        harvest.seasonName = item.season.name;
        harvest.amount = item.amount;
        harvest.comment = item.comment;
        harvest.date = item.date;
        return harvest;
    }
}