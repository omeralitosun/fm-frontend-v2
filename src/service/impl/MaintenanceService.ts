import { Service } from 'typedi';
import axios, { type AxiosResponse } from "axios";
import type { IMaintenanceService } from '../IMaintenanceService';
import { Maintenance } from '@/model/maintenance/Maintenance';
import { MaintenanceType } from '@/constants/MaintenanceType';
import { CreateMaintenance } from '@/model/maintenance/CreateMaintenance';

@Service()
export class MaintenanceService implements IMaintenanceService {

    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiMaintenanceURL = this.apiUrl + "/api/v1/maintenance"

    async getAllMaintenance(page: number, rows: number): Promise<Maintenance[]> {
        let pathVariable = this.apiMaintenanceURL + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        return response.data.map((item: any) => {
            const maintenance = new Maintenance();
            const type = this.getMaintenanceTypeByKey(item.maintenanceType);

            if (type) {
                maintenance.maintenanceType = type.label;
            }

            maintenance.id = item.id;
            maintenance.equipment = item.equipment;
            maintenance.cost = item.cost;
            maintenance.comment = item.comment;
            maintenance.date = item.date;

            return maintenance;
        });
    }

    async deleteMaintenance(id: string): Promise<void> {
        let pathVariable = this.apiMaintenanceURL + "/" + id;
        const response = await axios.delete(pathVariable)
    }

    getMaintenanceTypes(): MaintenanceType[] {
        return MaintenanceType.values();
    }

    async addMaintenance(maintenance: CreateMaintenance): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiMaintenanceURL;
        return await axios.post(pathVariable, maintenance);
    }

    async getAllMaintenanceByEquipmentId(equipmentId: string, page: number, rows: number): Promise<Maintenance[]> {
        let pathVariable = this.apiMaintenanceURL + "/equipment/" + equipmentId + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);


        return response.data.map((item: any) => {
            const maintenance = new Maintenance();
            const type = this.getMaintenanceTypeByKey(item.maintenanceType);

            if (type) {
                maintenance.maintenanceType = type.label;
            }

            maintenance.id = item.id;
            maintenance.equipment = item.equipment;
            maintenance.cost = item.cost;
            maintenance.comment = item.comment;
            maintenance.date = item.date;

            return maintenance;
        });
    }

    getMaintenanceTypeByKey(key: string): MaintenanceType | undefined {
        return MaintenanceType.getMaintenanceTypeByKey(key);
    }
}