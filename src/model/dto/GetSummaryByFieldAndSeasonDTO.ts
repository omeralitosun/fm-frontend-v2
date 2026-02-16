
import type { GetHarvestWithoutDetailDTO } from "./GetHarvestWithoutDetailDTO";
import type { GetActionTakenWithoutDetailDTO } from "./GetActionTakenWithoutDetailDTO";

export class GetSummmaryByFieldAndSeasonDTO{
    actionTakens!: GetActionTakenWithoutDetailDTO[];
    harvests!: GetHarvestWithoutDetailDTO[];
}