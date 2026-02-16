import { EquipmentType } from '@/constants/EquipmentType';
import type { GetAllEquipmentDTO } from '@/model/dto/GetAllEquipmentDTO';
import { Equipment } from '@/model/equipment/Equipment';
import type { AxiosResponse } from 'axios';

export interface IEquipmentService {
    getAllEquipment(page: number, rows: number): Promise<GetAllEquipmentDTO>;
    deleteEquipment(id: string): Promise<void>;
    getEquipmentTypes(): EquipmentType[];
    addEquipment(equipment: Equipment): Promise<AxiosResponse<any, any>>;
    getEquipment(id: string): Promise<Equipment>;
    getEquipmentTypeByKey(key: string): EquipmentType | undefined;
    updateEquipment(id: string, equipment: Equipment): Promise<AxiosResponse<any, any>>;
}