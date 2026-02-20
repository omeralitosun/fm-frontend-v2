import type { SelledProduct } from "../selledproduct/SelledProduct";

export class GetAllSelledProductsDto{
    selledProducts!: SelledProduct[];
    totalElements!: number;
}