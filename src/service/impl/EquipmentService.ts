import { Service } from 'typedi';
import axios, { type AxiosResponse } from "axios";
import { Equipment } from '@/model/equipment/Equipment';
import type { IEquipmentService } from '@/service/IEquipmentService';
import { EquipmentType } from '@/constants/EquipmentType';
import { GetAllEquipmentDTO } from '@/model/dto/GetAllEquipmentDTO';

@Service()
export class EquipmentService implements IEquipmentService {


    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiEquipmentURL = this.apiUrl + "/api/v1/equipment"

    async getAllEquipment(page: number, rows: number): Promise<GetAllEquipmentDTO> {
        let pathVariable = this.apiEquipmentURL + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        const getAllEquipmentDTO = new GetAllEquipmentDTO();

        getAllEquipmentDTO.totalElements = response.data.totalElements;
        getAllEquipmentDTO.equipments = response.data.equipments.map((item: any) => {
            const equipment = new Equipment();
            const type = this.getEquipmentTypeByKey(item.equipmentType);

            if (type) {
                equipment.equipmentType = type.label;
            }
            equipment.id = item.id;
            equipment.name = item.name;

            return equipment;
        })

        return getAllEquipmentDTO;
    }

    async deleteEquipment(id: string): Promise<void> {
        let pathVariable = this.apiEquipmentURL + "/" + id;
        const response = await axios.delete(pathVariable)
    }

    getEquipmentTypes(): EquipmentType[] {
        return EquipmentType.values();
    };

    async addEquipment(equipment: Equipment): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiEquipmentURL;
        return await axios.post(pathVariable, equipment);
    }

    async getEquipment(id: string): Promise<Equipment> {
        let pathVariable = this.apiEquipmentURL + "/" + id;
        const response = await axios.get(pathVariable);
        const equipment = new Equipment;

        equipment.id = response.data.id;
        equipment.name = response.data.name;
        equipment.equipmentType = response.data.equipmentType;

        return equipment;
    }
    
    getEquipmentTypeByKey(key: string): EquipmentType | undefined {
        return EquipmentType.getEquipmentTypeByKey(key);
    }

    async updateEquipment(id: string, equipment: Equipment): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiEquipmentURL + "/" + id;
        return await axios.put(pathVariable, equipment);
    }
}


