import type { CreateSelledProduct } from "@/model/selledproduct/CreateSelledProduct";
import type { SelledProduct } from "@/model/selledproduct/SelledProduct";
import type { AxiosResponse } from "axios";

export interface ISelledProductService {
    addSelledProduct(createSelledProduct: CreateSelledProduct): Promise<AxiosResponse<any, any>>;
    getAllSelledProduct(page: number, size: number): Promise<SelledProduct[]>;
    deleteSelledProduct(id: string): Promise<void>;
}