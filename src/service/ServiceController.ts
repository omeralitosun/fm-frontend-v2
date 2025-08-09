import { Container } from "typedi";
import type { IEquipmentService } from "./IEquipmentService";
import { EquipmentService } from "./impl/EquipmentService";
import type { IMaintenanceService } from "./IMaintenanceService";
import { MaintenanceService } from "./impl/MaintenanceService";

export class ServiceController {

    static getEquipmentService(): IEquipmentService {
        return Container.get<IEquipmentService>(EquipmentService);
    }

    static getMaintenanceService(): IMaintenanceService {
        return Container.get<IMaintenanceService>(MaintenanceService);
    }
}