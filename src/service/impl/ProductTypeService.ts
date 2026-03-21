import { Service } from "typedi";
import type { IProductTypeService } from "../IProductTypeService";
import api from "../api";
import { CreateProductType } from "@/model/producttype/CreateProductType";
import { ProductType } from "@/model/producttype/ProductType";
import { GetAllProductTypeDTO } from "@/model/dto/GetAllProductTypeDTO";

@Service()
export class ProductTypeService implements IProductTypeService {
    private readonly apiProductTypeURL = "/api/v1/productType";

    async addProductType(productType: CreateProductType) {
        return await api.post(this.apiProductTypeURL, productType);
    }

    async getAllProductTypes(page: number, rows: number, name: string): Promise<GetAllProductTypeDTO> {
        const response = await api.get(this.apiProductTypeURL, {
            params: { page, rows, name }
        });
        return this.mapToGetAllProductTypeDTO(response.data);
    }

    private mapToGetAllProductTypeDTO(data: any): GetAllProductTypeDTO {
        const dto = new GetAllProductTypeDTO();
        dto.totalElements = data.totalElements;
        dto.productTypes = data.productTypes.map((item: any) => this.mapToProductType(item));
        return dto;
    }

    private mapToProductType(item: any): ProductType {
        const productType = new ProductType();
        productType.id = item.id;
        productType.name = item.name;
        productType.unit = item.unit;
        productType.totalAmount = item.totalAmount;
        return productType;
    }
}