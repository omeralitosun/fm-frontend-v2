import { CreateUsedProduct } from "../usedproduct/CreateUsedProduct";

export class CreateActionTaken {
    process!: string;
    fieldId!: number;
    seasonId!: number;
    comment!: string;
    date!: Date;
    cost!: number;
    usedProducts!: CreateUsedProduct[];
}