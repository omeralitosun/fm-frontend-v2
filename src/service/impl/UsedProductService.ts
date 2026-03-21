import { Service } from "typedi";
import type { IUsedProductService } from "../IUsedProductService";
import api from "../api";
import { GetAllUsedProductsDTO } from "@/model/dto/GetAllUsedProductDTO";
import { UsedProduct } from "@/model/usedproduct/UsedProduct";

@Service()
export class UsedProductService implements IUsedProductService {
    private readonly apiUsedProductURL = "/api/v1/used-product";

    async getAllUsedProductsByActionTakenId(actionTakenId: number, page: number, rows: number): Promise<GetAllUsedProductsDTO> {
        const response = await api.get(`${this.apiUsedProductURL}/action-taken/${actionTakenId}`, {
            params: { page, rows }
        });
        return this.mapToGetAllUsedProductsDto(response.data);
    }

    private mapToGetAllUsedProductsDto(data: any): GetAllUsedProductsDTO {
        const dto = new GetAllUsedProductsDTO();
        dto.totalElements = data.totalElements;
        dto.usedProducts = data.usedProducts.map((item: any) => this.mapToUsedProduct(item));
        return dto;
    }

    private mapToUsedProduct(item: any): UsedProduct {
        const usedProduct = new UsedProduct();
        usedProduct.id = item.id;
        usedProduct.productTypeId = item.productType.id;
        usedProduct.productTypeName = item.productType.name;
        usedProduct.amount = item.amount;
        usedProduct.unitPrice = item.unitPrice;
        return usedProduct;
    }
}
