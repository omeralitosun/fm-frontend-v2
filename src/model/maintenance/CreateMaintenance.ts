import type { Equipment } from "../equipment/Equipment";

export class CreateMaintenance {
    equipmentId!: number;
    maintenanceType!: string;
    cost!: number;
    comment!: string;
    date!: Date;
}