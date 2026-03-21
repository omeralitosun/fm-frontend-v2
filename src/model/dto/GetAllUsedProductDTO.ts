import type { UsedProduct } from "../usedproduct/UsedProduct";

export class GetAllUsedProductsDTO {
    usedProducts!: UsedProduct[];
    totalElements!: number;
}