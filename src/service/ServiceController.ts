import { Container } from "typedi";
import type { IEquipmentService } from "./IEquipmentService";
import { EquipmentService } from "./impl/EquipmentService";
import type { IMaintenanceService } from "./IMaintenanceService";
import { MaintenanceService } from "./impl/MaintenanceService";
import type { IFieldService } from "./IFieldService";
import { FieldService } from "./impl/FieldService";
import type { IActionTakenService } from "./IActionTakenService";
import { ActionTakenService } from "./impl/ActionTakenService";
import type { ISeasonService } from "./ISeasonService";
import { SeasonService } from "./impl/SeasonService";
import type { IProductTypeService } from "./IProductTypeService";
import { ProductTypeService } from "./impl/ProductTypeService";
import { ReceivedProductService } from "./impl/ReceivedProductService";
import type { IReceivedProductService } from "./IReceivedProductService";
import type { ISelledProductService } from "./ISelledProductService";
import { SelledProductService } from "./impl/SelledProductService";
import { SummaryService } from "./impl/SummaryService";
import type { ISummaryService } from "./ISummaryService";

export class ServiceController {

    static getEquipmentService(): IEquipmentService {
        return Container.get<IEquipmentService>(EquipmentService);
    }

    static getMaintenanceService(): IMaintenanceService {
        return Container.get<IMaintenanceService>(MaintenanceService);
    }

    static getFieldService() {
        return Container.get<IFieldService>(FieldService);
    }

    static getActionTakenService() {
        return Container.get<IActionTakenService>(ActionTakenService);
    }

    static getSeasonService() {
        return Container.get<ISeasonService>(SeasonService);
    }

    static getProductTypeService() {
        return Container.get<IProductTypeService>(ProductTypeService);
    }

    static getReceivedProductService() {
        return Container.get<IReceivedProductService>(ReceivedProductService);
    }

    static getSelledProductService() {
        return Container.get<ISelledProductService>(SelledProductService);
    }

    static getSummaryService() {
        return Container.get<ISummaryService>(SummaryService);
    }
}