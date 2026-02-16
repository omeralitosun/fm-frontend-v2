import type { GetSummmaryByFieldAndSeasonDTO } from "@/model/dto/GetSummaryByFieldAndSeasonDTO";


export interface ISummaryService {
    getSummaryByFieldAndSeason(fieldId: number, seasonId: number): Promise<GetSummmaryByFieldAndSeasonDTO>;
}