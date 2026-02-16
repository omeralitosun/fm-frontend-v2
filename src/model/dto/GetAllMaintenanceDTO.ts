import { Maintenance } from "../maintenance/Maintenance";

export class GetAllMaintenanceDTO{
    maintenances!: Maintenance[];
    totalElements!: number;
}