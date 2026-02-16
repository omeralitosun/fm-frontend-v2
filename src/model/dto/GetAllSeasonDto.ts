import type { Season } from "../season/Season";

export class GetAllSeasonDto{
    seasons!: Season[];
    totalElements!: number;
}