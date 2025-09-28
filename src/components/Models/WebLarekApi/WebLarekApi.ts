import { IApi, IProductList, IOrderResult, IOrderRequest} from "../../../types";

export class WebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise<IProductList> {
        return await this.api.get<IProductList>('/api/product');
    }

    async createOrder(order: IOrderRequest): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/api/order', order);
    }
}