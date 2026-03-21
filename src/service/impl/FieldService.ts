import { Service } from "typedi";
import type { IFieldService } from "../IFieldService";
import api from "../api";
import { CreateField } from "@/model/field/CreateField";
import { Field } from "@/model/field/Field";
import { GetAllFieldDTO } from "@/model/dto/GetAllFieldDTO";

@Service()
export class FieldService implements IFieldService {
    private readonly apiFieldURL = "/api/v1/field";

    async addField(field: CreateField) {
        return await api.post(this.apiFieldURL, field);
    }

    async getField(id: string): Promise<Field> {
        const response = await api.get(`${this.apiFieldURL}/${id}`);
        return this.mapToField(response.data);
    }

    async getAllField(page: number, rows: number): Promise<GetAllFieldDTO> {
        const response = await api.get(this.apiFieldURL, {
            params: { page, rows }
        });
        return this.mapToGetAllFieldDTO(response.data);
    }

    async deleteField(id: string): Promise<void> {
        await api.delete(`${this.apiFieldURL}/${id}`);
    }

    async updateField(id: string, field: CreateField) {
        return await api.put(`${this.apiFieldURL}/${id}`, field);
    }

    private mapToGetAllFieldDTO(data: any): GetAllFieldDTO {
        const dto = new GetAllFieldDTO();
        dto.totalElements = data.totalElements;
        dto.fields = data.fields.map((item: any) => this.mapToField(item));
        return dto;
    }

    private mapToField(item: any): Field {
        const field = new Field();
        field.id = item.id;
        field.name = item.name;
        field.decare = item.decare;
        return field;
    }
}