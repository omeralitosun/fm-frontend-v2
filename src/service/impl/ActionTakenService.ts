import { Service } from "typedi";
import type { IActionTakenService } from "../IActionTakenService";
import axios from "axios";
import { CreateField } from "@/model/field/CreateField";
import type { AxiosResponse } from "axios";
import { Field } from "@/model/field/Field";
import { ActionTaken } from "@/model/actiontaken/ActionTaken";
import { Process } from "@/constants/Process";
import type { CreateActionTaken } from "@/model/actiontaken/CreateActionTaken";
import { GetAllActionTakenDTO } from "@/model/dto/GetAllActionTakenDTO";

@Service()
export class ActionTakenService implements IActionTakenService {

    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiActionTaken = this.apiUrl + "/api/v1/action-taken"

    async getAllActionTakenByFieldAndSeason(fieldId: number, seasonId: number, page: number, rows: number): Promise<GetAllActionTakenDTO> {
        let pathVariable = this.apiActionTaken +
            "?fieldId=" + fieldId +
            "&seasonId=" + seasonId +
            "&page=" + page +
            "&rows=" + rows;

        const response = await axios.get(pathVariable);

        const getAllActionTakenDTO = new GetAllActionTakenDTO();

        getAllActionTakenDTO.totalElements = response.data.totalElements;
        getAllActionTakenDTO.actionTakens = response.data.actionTakens.map((item: any) => {
            const actionTaken = new ActionTaken();

            actionTaken.id = item.id;
            actionTaken.field = item.field;
            actionTaken.process = item.process;
            const process = this.getProcessByKey(item.process);
            if (process) {
                actionTaken.process = process.label;
            }
            actionTaken.cost = item.cost;
            actionTaken.comment = item.comment;
            actionTaken.date = item.date;

            return actionTaken;
        });

        return getAllActionTakenDTO;
    }

    getProcessByKey(key: string): Process | undefined {
        return Process.getProcessByKey(key);
    }

    async addActionTaken(actionTaken: CreateActionTaken): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiActionTaken;
        console.log("Adding action taken: ", actionTaken);
        return await axios.post(pathVariable, actionTaken);
    }

    async getAllActionTaken(page: number, rows: number): Promise<GetAllActionTakenDTO> {
        let pathVariable = this.apiActionTaken + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        const getAllActionTakenDTO = new GetAllActionTakenDTO();

        getAllActionTakenDTO.totalElements = response.data.totalElements;
        getAllActionTakenDTO.actionTakens = response.data.actionTakens.map((item: any) => {
            const actionTaken = new ActionTaken();

            actionTaken.id = item.id;
            actionTaken.field = item.field;
            actionTaken.process = item.process;
            const process = this.getProcessByKey(item.process);
            if (process) {
                actionTaken.process = process.label;
            }
            actionTaken.cost = item.cost;
            actionTaken.comment = item.comment;
            actionTaken.date = item.date;

            return actionTaken;
        });

        return getAllActionTakenDTO;
    }

    async deleteActionTaken(id: number): Promise<void> {
        let pathVariable = this.apiActionTaken + "/" + id;
        await axios.delete(pathVariable);
    }
}