import type { ProductType } from "../producttype/ProductType";

export class GetHarvestWithoutDetailDTO{
    productName!: string;
    totalAmount!: number;
    amountPerDecare!: number;
    averageUnitPrice!: number;
    totalIncome!: number;
}