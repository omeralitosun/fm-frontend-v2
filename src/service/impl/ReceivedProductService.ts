import { Service } from "typedi";
import type { IReceivedProductService } from "../IReceivedProductService";
import api from "../api";
import { CreateReceivedProduct } from "@/model/receivedproduct/CreateReceivedProduct";
import { ReceivedProduct } from "@/model/receivedproduct/ReceivedProduct";
import { GetAllReceivedProductDTO } from "@/model/dto/GetAllReceivedProductDTO";

@Service()
export class ReceivedProductService implements IReceivedProductService {
    private readonly apiReceivedProductURL = "/api/v1/receivedProduct";

    async addReceivedProduct(receivedProduct: CreateReceivedProduct) {
        return await api.post(this.apiReceivedProductURL, receivedProduct);
    }

    async getAllReceivedProduct(page: number, rows: number): Promise<GetAllReceivedProductDTO> {
        const response = await api.get(this.apiReceivedProductURL, {
            params: { page, rows }
        });
        return this.mapToGetAllReceivedProductDTO(response.data);
    }

    async deleteReceivedProduct(id: string): Promise<void> {
        await api.delete(`${this.apiReceivedProductURL}/${id}`);
    }

    private mapToGetAllReceivedProductDTO(data: any): GetAllReceivedProductDTO {
        const dto = new GetAllReceivedProductDTO();
        dto.totalElements = data.totalElements;
        dto.receivedProducts = data.receivedProducts.map((item: any) => this.mapToReceivedProduct(item));
        return dto;
    }

    private mapToReceivedProduct(item: any): ReceivedProduct {
        const receivedProduct = new ReceivedProduct();
        receivedProduct.id = item.id;
        receivedProduct.productTypeId = item.productType.id;
        receivedProduct.productTypeName = item.productType.name;
        receivedProduct.amount = item.amount;
        receivedProduct.unit = item.unit;
        receivedProduct.unitPrice = item.unitPrice;
        receivedProduct.comment = item.comment;
        receivedProduct.date = item.date;
        return receivedProduct;
    }
}