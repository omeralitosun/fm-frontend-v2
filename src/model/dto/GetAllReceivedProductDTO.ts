import type { ReceivedProduct } from "../receivedproduct/ReceivedProduct";

export class GetAllReceivedProductDTO{
    receivedProducts!: ReceivedProduct[];
    totalElements!: number;
}