import { Service } from 'typedi';
import api from "../api";
import type { IMaintenanceService } from '../IMaintenanceService';
import { Maintenance } from '@/model/maintenance/Maintenance';
import { MaintenanceType } from '@/constants/MaintenanceType';
import { CreateMaintenance } from '@/model/maintenance/CreateMaintenance';
import { GetAllMaintenanceDTO } from '@/model/dto/GetAllMaintenanceDTO';

@Service()
export class MaintenanceService implements IMaintenanceService {
    private readonly apiMaintenanceURL = "/api/v1/maintenance";

    async getAllMaintenance(page: number, rows: number): Promise<GetAllMaintenanceDTO> {
        const response = await api.get(this.apiMaintenanceURL, {
            params: { page, rows }
        });
        return this.mapToGetAllMaintenanceDTO(response.data);
    }

    async deleteMaintenance(id: string): Promise<void> {
        await api.delete(`${this.apiMaintenanceURL}/${id}`);
    }

    async addMaintenance(maintenance: CreateMaintenance) {
        return await api.post(this.apiMaintenanceURL, maintenance);
    }

    async getAllMaintenanceByEquipmentId(equipmentId: string, page: number, rows: number): Promise<GetAllMaintenanceDTO> {
        const response = await api.get(`${this.apiMaintenanceURL}/equipment/${equipmentId}`, {
            params: { page, rows }
        });
        return this.mapToGetAllMaintenanceDTO(response.data);
    }

    private mapToGetAllMaintenanceDTO(data: any): GetAllMaintenanceDTO {
        const dto = new GetAllMaintenanceDTO();
        dto.totalElements = data.totalElements;
        dto.maintenances = data.maintenances.map((item: any) => this.mapToMaintenance(item));
        return dto;
    }

    private mapToMaintenance(item: any): Maintenance {
        const maintenance = new Maintenance();
        maintenance.id = item.id;
        maintenance.equipment = item.equipment;
        maintenance.cost = item.cost;
        maintenance.comment = item.comment;
        maintenance.date = item.date;

        const type = MaintenanceType.getMaintenanceTypeByKey(item.maintenanceType);
        maintenance.maintenanceType = type ? type.label : item.maintenanceType;

        return maintenance;
    }
}