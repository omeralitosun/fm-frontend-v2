import { EquipmentType } from '@/constants/EquipmentType';
import type { CreateEquipment } from '@/model/equipment/CreateEquipment';
import { Equipment } from '@/model/equipment/Equipment';
import type { AxiosResponse } from 'axios';

export interface IEquipmentService {
    getAllEquipment(page: number, rows: number): Promise<Equipment[]>;
    deleteEquipment(id: string): Promise<void>;
    getEquipmentTypes(): EquipmentType[];
    addEquipment(equipment: CreateEquipment): Promise<AxiosResponse<any, any>>;
    getEquipment(id: string): Promise<Equipment>;
    getEquipmentTypeByKey(key: string): EquipmentType | undefined;
    updateEquipment(id: string, equipment: CreateEquipment): Promise<AxiosResponse<any, any>>;
}