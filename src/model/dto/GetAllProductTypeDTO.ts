import { ProductType } from "../producttype/ProductType";

export class GetAllProductTypeDTO{
    productTypes!: ProductType[];
    totalElements!: number;
}