import { ActionTaken } from "@/model/actiontaken/ActionTaken";
import type { CreateActionTaken } from "@/model/actiontaken/CreateActionTaken";
import type { GetAllActionTakenDTO } from "@/model/dto/GetAllActionTakenDTO";
import type { AxiosResponse } from "axios";

export interface IActionTakenService {
    getAllActionTakenByFieldAndSeason(fieldId: number, seasonId: number, page: number, rows: number): Promise<GetAllActionTakenDTO>;
    getAllActionTaken(page: number, rows: number): Promise<GetAllActionTakenDTO>;
    addActionTaken(actionTaken: CreateActionTaken): Promise<AxiosResponse<any, any>>;
    deleteActionTaken(id: number): Promise<void>;
}