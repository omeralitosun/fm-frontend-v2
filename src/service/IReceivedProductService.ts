import type { GetAllReceivedProductDTO } from "@/model/dto/GetAllReceivedProductDTO";
import type { CreateReceivedProduct } from "@/model/receivedproduct/CreateReceivedProduct";
import type { AxiosResponse } from "axios";

export interface IReceivedProductService {
    addReceivedProduct(createReceivedProduct: CreateReceivedProduct): Promise<AxiosResponse<any, any>>;
    getAllReceivedProduct(page: number, size: number): Promise<GetAllReceivedProductDTO>;
    deleteReceivedProduct(id: string): Promise<void>;
}