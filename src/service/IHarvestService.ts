import type { GetAllHarvestDTO } from "@/model/dto/GetAllHarvestDTO";
import type { CreateHarvest } from "@/model/harvest/CreateHarvest";
import type { AxiosResponse } from "axios";

export interface IHarvestService {
    addHarvest(createHarvest: CreateHarvest): Promise<AxiosResponse<any, any>>;
    getAllHarvest(page: number, size: number): Promise<GetAllHarvestDTO>;
    deleteHarvest(id: number): Promise<void>;
}