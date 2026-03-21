import { Service } from 'typedi';
import api from "../api";
import { Equipment } from '@/model/equipment/Equipment';
import type { IEquipmentService } from '@/service/IEquipmentService';
import { EquipmentType } from '@/constants/EquipmentType';
import { GetAllEquipmentDTO } from '@/model/dto/GetAllEquipmentDTO';

@Service()
export class EquipmentService implements IEquipmentService {
    private readonly apiEquipmentURL = "/api/v1/equipment";

    async getAllEquipment(page: number, rows: number): Promise<GetAllEquipmentDTO> {
        const response = await api.get(this.apiEquipmentURL, {
            params: { page, rows }
        });
        return this.mapToGetAllEquipmentDTO(response.data);
    }

    async deleteEquipment(id: string): Promise<void> {
        await api.delete(`${this.apiEquipmentURL}/${id}`);
    }

    getEquipmentTypes(): EquipmentType[] {
        return EquipmentType.values();
    };

    async addEquipment(equipment: Equipment) {
        return await api.post(this.apiEquipmentURL, equipment);
    }

    async getEquipment(id: string): Promise<Equipment> {
        const response = await api.get(`${this.apiEquipmentURL}/${id}`);
        return this.mapToEquipment(response.data);
    }

    private mapToGetAllEquipmentDTO(data: any): GetAllEquipmentDTO {
        const dto = new GetAllEquipmentDTO();
        dto.totalElements = data.totalElements;
        dto.equipments = data.equipments.map((item: any) => this.mapToEquipment(item));
        return dto;
    }

    private mapToEquipment(item: any): Equipment {
        const equipment = new Equipment();
        equipment.id = item.id;
        equipment.name = item.name;

        const type = EquipmentType.getEquipmentTypeByKey(item.equipmentType);
        equipment.equipmentType = type ? type.label : item.equipmentType;

        return equipment;
    }

    async updateEquipment(id: string, equipment: Equipment) {
        return await api.put(`${this.apiEquipmentURL}/${id}`, equipment);
    }
}


