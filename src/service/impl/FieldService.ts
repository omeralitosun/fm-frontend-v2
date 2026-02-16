import { Service } from "typedi";
import type { IFieldService } from "../IFieldService";
import axios from "axios";
import { CreateField } from "@/model/field/CreateField";
import type { AxiosResponse } from "axios";
import { Field } from "@/model/field/Field";
import { GetAllFieldDTO } from "@/model/dto/GetAllFieldDTO";

@Service()
export class FieldService implements IFieldService {
    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiFieldURL = this.apiUrl + "/api/v1/field"

    async addField(field: CreateField): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiFieldURL;
        return await axios.post(pathVariable, field);
    }

    async getField(id: string): Promise<Field> {
        let pathVariable = this.apiFieldURL + "/" + id;
        const response = await axios.get(pathVariable);
        const field = new Field();

        field.id = response.data.id;
        field.name = response.data.name;
        field.decare = response.data.decare;

        return field;
    }

    async getAllField(page: number, rows: number): Promise<GetAllFieldDTO> {
        let pathVariable = this.apiFieldURL + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        const getAllFieldDTO = new GetAllFieldDTO();

        getAllFieldDTO.totalElements = response.data.totalElements;
        getAllFieldDTO.fields = response.data.fields.map((item: any) => {
            const field = new Field();

            field.id = item.id;
            field.name = item.name;
            field.decare = item.decare;

            return field;
        });

        return getAllFieldDTO;
    }

    async deleteField(id: string): Promise<void> {
        let pathVariable = this.apiFieldURL + "/" + id;
        const response = await axios.delete(pathVariable)
    }

    async updateField(id: string, field: CreateField): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiFieldURL + "/" + id;
        return await axios.put(pathVariable, field);
    }
}