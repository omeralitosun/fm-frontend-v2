import type { Equipment } from "../equipment/Equipment";

export class CreateMaintenance {
    equipmentId!: string;
    maintenanceType!: string;
    cost!: number;
    comment!: string;
    date!: Date;
}