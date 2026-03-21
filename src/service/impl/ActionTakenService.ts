import { Service } from "typedi";
import type { IActionTakenService } from "../IActionTakenService";
import api from "../api";
import { ActionTaken } from "@/model/actiontaken/ActionTaken";
import { Process } from "@/constants/Process";
import type { CreateActionTaken } from "@/model/actiontaken/CreateActionTaken";
import { GetAllActionTakenDTO } from "@/model/dto/GetAllActionTakenDTO";

@Service()
export class ActionTakenService implements IActionTakenService {
    private readonly apiActionTaken = "/api/v1/action-taken";

    async getAllActionTakenByFieldAndSeason(fieldId: number, seasonId: number, page: number, rows: number): Promise<GetAllActionTakenDTO> {
        const response = await api.get(this.apiActionTaken, {
            params: { fieldId, seasonId, page, rows }
        });
        return this.mapToGetAllActionTakenDTO(response.data);
    }

    async getAllActionTaken(page: number, rows: number): Promise<GetAllActionTakenDTO> {
        const response = await api.get(this.apiActionTaken, {
            params: { page, rows }
        });
        return this.mapToGetAllActionTakenDTO(response.data);
    }

    async addActionTaken(actionTaken: CreateActionTaken) {
        return await api.post(this.apiActionTaken, actionTaken);
    }

    async deleteActionTaken(id: number): Promise<void> {
        await api.delete(`${this.apiActionTaken}/${id}`);
    }

    private mapToGetAllActionTakenDTO(data: any): GetAllActionTakenDTO {
        const dto = new GetAllActionTakenDTO();
        dto.totalElements = data.totalElements;
        dto.actionTakens = data.actionTakens.map((item: any) => this.mapToActionTaken(item));
        return dto;
    }

    private mapToActionTaken(item: any): ActionTaken {
        const actionTaken = new ActionTaken();
        actionTaken.id = item.id;
        actionTaken.field = item.field;
        actionTaken.cost = item.cost;
        actionTaken.comment = item.comment;
        actionTaken.date = item.date;

        const process = Process.getProcessByKey(item.process);
        actionTaken.process = process ? process.label : item.process;

        return actionTaken;
    }
}