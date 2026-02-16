import type { GetAllProductTypeDTO } from "@/model/dto/GetAllProductTypeDTO";
import type { CreateProductType } from "@/model/producttype/CreateProductType";
import type { ProductType } from "@/model/producttype/ProductType";
import type { AxiosResponse } from "axios";

export interface IProductTypeService {
    addProductType(createProductType: CreateProductType): Promise<AxiosResponse<any, any>>;
    getAllProductTypes(page: number, rows: number, name: string): Promise<GetAllProductTypeDTO>;

}