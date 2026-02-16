import { Service } from "typedi";
import type { IProductTypeService } from "../IProductTypeService";
import axios from "axios";
import { CreateProductType } from "@/model/producttype/CreateProductType";
import type { AxiosResponse } from "axios";
import { ProductType } from "@/model/producttype/ProductType";
import { GetAllProductTypeDTO } from "@/model/dto/GetAllProductTypeDTO";

@Service()
export class ProductTypeService implements IProductTypeService {
    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiProductTypeURL = this.apiUrl + "/api/v1/productType"

    async addProductType(ProductType: CreateProductType): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiProductTypeURL;
        return await axios.post(pathVariable, ProductType);
    }

    async getAllProductTypes(page: number, rows: number, name: string): Promise<GetAllProductTypeDTO> {
        let pathVariable = this.apiProductTypeURL + "?page=" + page + "&rows=" + rows + "&name=" + name;
        const response = await axios.get(pathVariable);

        const getAllProductTypeDTO = new GetAllProductTypeDTO();
        getAllProductTypeDTO.productTypes = response.data.productTypes.map((item: any) => {
            const productType = new ProductType();

            productType.id = item.id;
            productType.name = item.name;
            productType.unit = item.unit;
            productType.totalAmount = item.totalAmount;


            return productType;
        });
        getAllProductTypeDTO.totalElements = response.data.totalElements;
        return getAllProductTypeDTO;
    }
}