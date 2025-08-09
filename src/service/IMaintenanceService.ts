import { Maintenance } from '@/model/maintenance/Maintenance';
import type { MaintenanceType } from '@/constants/MaintenanceType';
import { CreateMaintenance } from '@/model/maintenance/CreateMaintenance'
import type { AxiosResponse } from 'axios';

export interface IMaintenanceService {
    getAllMaintenance(page: number, rows: number): Promise<Maintenance[]>;
    deleteMaintenance(id: string): Promise<void>;
    getMaintenanceTypes(): MaintenanceType[];
    addMaintenance(maintenance: CreateMaintenance): Promise<AxiosResponse<any, any>>;
    getAllMaintenanceByEquipmentId(equipmentId: string, page: number, rows: number): Promise<Maintenance[]>;
    getMaintenanceTypeByKey(key: string): MaintenanceType | undefined;
    /*
    getMaintenance(id: string): Promise<Maintenance>;

    updateMaintenance(id: string, Maintenance: CreateMaintenance): Promise<AxiosResponse<any, any>>;
    */
}