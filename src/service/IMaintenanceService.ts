import { CreateMaintenance } from '@/model/maintenance/CreateMaintenance'
import type { AxiosResponse } from 'axios';
import type { GetAllMaintenanceDTO } from '@/model/dto/GetAllMaintenanceDTO';

export interface IMaintenanceService {
    getAllMaintenance(page: number, rows: number): Promise<GetAllMaintenanceDTO>;
    deleteMaintenance(id: string): Promise<void>;
    addMaintenance(maintenance: CreateMaintenance): Promise<AxiosResponse<any, any>>;
    getAllMaintenanceByEquipmentId(equipmentId: string, page: number, rows: number): Promise<GetAllMaintenanceDTO>;
}