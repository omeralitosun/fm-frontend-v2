import type { GetAllUsedProductsDTO } from "@/model/dto/GetAllUsedProductDTO";

export interface IUsedProductService {
    getAllUsedProductsByActionTakenId(actionTakenId: number, page: number, rows: number): Promise<GetAllUsedProductsDTO>;
}