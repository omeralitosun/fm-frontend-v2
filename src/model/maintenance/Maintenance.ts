import type { Equipment } from "../equipment/Equipment";

export class Maintenance {
    id!: string;
    equipment!: Equipment;
    maintenanceType!: string;
    cost!: number;
    comment!: string;
    date!: Date;
}