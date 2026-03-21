import { Service } from "typedi";
import type { ISelledProductService } from "../ISelledProductService";
import api from "../api";
import { CreateSelledProduct } from "@/model/selledproduct/CreateSelledProduct";
import { SelledProduct } from "@/model/selledproduct/SelledProduct";
import { GetAllSelledProductsDto } from "@/model/dto/GetAllSelledProductsDTO";

@Service()
export class SelledProductService implements ISelledProductService {
    private readonly apiSelledProductURL = "/api/v1/selledProduct";

    async addSelledProduct(selledProduct: CreateSelledProduct) {
        return await api.post(this.apiSelledProductURL, selledProduct);
    }

    async getAllSelledProduct(page: number, rows: number): Promise<GetAllSelledProductsDto> {
        const response = await api.get(this.apiSelledProductURL, {
            params: { page, rows }
        });
        return this.mapToGetAllSelledProductsDto(response.data);
    }

    async deleteSelledProduct(id: number): Promise<void> {
        await api.delete(`${this.apiSelledProductURL}/${id}`);
    }

    private mapToGetAllSelledProductsDto(data: any): GetAllSelledProductsDto {
        const dto = new GetAllSelledProductsDto();
        dto.totalElements = data.totalElements;
        dto.selledProducts = data.selledProducts.map((item: any) => this.mapToSelledProduct(item));
        return dto;
    }

    private mapToSelledProduct(item: any): SelledProduct {
        const selledProduct = new SelledProduct();
        selledProduct.id = item.id;
        selledProduct.productTypeId = item.productType.id;
        selledProduct.productTypeName = item.productType.name;
        selledProduct.amount = item.amount;
        selledProduct.unit = item.unit;
        selledProduct.unitPrice = item.unitPrice;
        selledProduct.comment = item.comment;
        selledProduct.date = item.date;
        return selledProduct;
    }
}