import type { Harvest } from "../harvest/Harvest";

export class GetAllHarvestDTO{
    harvests!: Harvest[];
    totalElements!: number;
}