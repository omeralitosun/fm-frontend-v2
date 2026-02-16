import { Service } from "typedi";
import type { IReceivedProductService } from "../IReceivedProductService";
import axios from "axios";
import { CreateReceivedProduct } from "@/model/receivedproduct/CreateReceivedProduct";
import type { AxiosResponse } from "axios";
import { ReceivedProduct } from "@/model/receivedproduct/ReceivedProduct";
import { GetAllReceivedProductDTO } from "@/model/dto/GetAllReceivedProductDTO";

@Service()
export class ReceivedProductService implements IReceivedProductService {
    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiReceivedProductURL = this.apiUrl + "/api/v1/receivedProduct"

    async addReceivedProduct(ReceivedProduct: CreateReceivedProduct): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiReceivedProductURL;
        return await axios.post(pathVariable, ReceivedProduct);
    }

    async getAllReceivedProduct(page: number, rows: number): Promise<GetAllReceivedProductDTO> {
        let pathVariable = this.apiReceivedProductURL + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        const getAllReceivedProductDTO = new GetAllReceivedProductDTO();

        getAllReceivedProductDTO.totalElements = response.data.totalElements;
        getAllReceivedProductDTO.receivedProducts = response.data.receivedProducts.map((item: any) => {
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
        });

        return getAllReceivedProductDTO;
    }

    async deleteReceivedProduct(id: string): Promise<void> {
        let pathVariable = this.apiReceivedProductURL + "/" + id;
        await axios.delete(pathVariable);
    }
}