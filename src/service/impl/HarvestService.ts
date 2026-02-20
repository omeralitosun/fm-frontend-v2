import { Service } from "typedi";
import type { IHarvestService } from "../IHarvestService";
import axios from "axios";
import { CreateHarvest } from "@/model/harvest/CreateHarvest";
import type { AxiosResponse } from "axios";
import { GetAllHarvestDTO } from "@/model/dto/GetAllHarvestDTO";
import { Harvest } from "@/model/harvest/Harvest";

@Service()
export class HarvestService implements IHarvestService {
    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiHarvestURL = this.apiUrl + "/api/v1/harvest"

    async addHarvest(Harvest: CreateHarvest): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiHarvestURL;
        return await axios.post(pathVariable, Harvest);
    }

    async getAllHarvest(page: number, rows: number): Promise<GetAllHarvestDTO> {
        let pathVariable = this.apiHarvestURL + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        console.log(response);
        const getAllHarvestDTO = new GetAllHarvestDTO();

        getAllHarvestDTO.totalElements = response.data.totalElements;
        getAllHarvestDTO.harvests = response.data.harvests.map((item: any) => {
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
        });
        
        return getAllHarvestDTO;
    }
    async deleteHarvest(id: number): Promise<void> {
        let pathVariable = this.apiHarvestURL + "/" + id;
        const response = await axios.delete(pathVariable)
    }
}