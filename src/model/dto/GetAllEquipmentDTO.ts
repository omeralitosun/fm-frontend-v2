import type { Equipment } from "../equipment/Equipment";

export class GetAllEquipmentDTO{
    equipments!: Equipment[];
    totalElements!: number;
}