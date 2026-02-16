import { Service } from "typedi";
import type { ISelledProductService } from "../ISelledProductService";
import axios from "axios";
import { CreateSelledProduct } from "@/model/selledproduct/CreateSelledProduct";
import type { AxiosResponse } from "axios";
import { SelledProduct } from "@/model/selledproduct/SelledProduct";

@Service()
export class SelledProductService implements ISelledProductService {
    apiUrl = import.meta.env.VITE_SERVICE_URL;
    apiSelledProductURL = this.apiUrl + "/api/v1/selledProduct"

    async addSelledProduct(SelledProduct: CreateSelledProduct): Promise<AxiosResponse<any, any>> {
        let pathVariable = this.apiSelledProductURL;
        return await axios.post(pathVariable, SelledProduct);
    }

    async getAllSelledProduct(page: number, rows: number): Promise<SelledProduct[]> {
        let pathVariable = this.apiSelledProductURL + "?page=" + page + "&rows=" + rows;
        const response = await axios.get(pathVariable);

        return response.data.map((item: any) => {
            const selledproduct = new SelledProduct();

            selledproduct.id = item.id;
            selledproduct.productTypeId = item.productType.id;
            selledproduct.productTypeName = item.productType.name;
            selledproduct.amount = item.amount;
            selledproduct.unit = item.unit;
            selledproduct.unitPrice = item.unitPrice;
            selledproduct.comment = item.comment;
            selledproduct.date = item.date;
            

            return selledproduct;
        });
    }
    deleteSelledProduct(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}