import type { GetAllSelledProductsDto } from "@/model/dto/GetAllSelledProductsDTO";
import type { CreateSelledProduct } from "@/model/selledproduct/CreateSelledProduct";
import type { AxiosResponse } from "axios";

export interface ISelledProductService {
    addSelledProduct(createSelledProduct: CreateSelledProduct): Promise<AxiosResponse<any, any>>;
    getAllSelledProduct(page: number, size: number): Promise<GetAllSelledProductsDto>;
    deleteSelledProduct(id: number): Promise<void>;
}