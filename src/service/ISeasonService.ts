import type { GetAllSeasonDto } from "@/model/dto/GetAllSeasonDto";
import type { Season } from "@/model/season/Season";

export interface ISeasonService {
    createSeasonFromCurrentYearToNextYear(): Promise<Season>;
    getAllSeasons(page: number, rows: number): Promise<GetAllSeasonDto>;
}