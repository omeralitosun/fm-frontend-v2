import type { ActionTaken } from "../actiontaken/ActionTaken";

export class GetAllActionTakenDTO{
    actionTakens!: ActionTaken[];
    totalElements!: number;
}