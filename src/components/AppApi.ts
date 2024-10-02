import { IApi, IOrder, IOrderResult, IProduct } from "../types";

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    getProducts(): Promise<{total: number, items: IProduct[]}> {
        return this._baseApi.get<{total: number, items: IProduct[]}>(`/product/`).then((products) => products)
    }

    getProductItem(productId: string): Promise<IProduct[]> {
        return this._baseApi.get<IProduct[]>(`/product/${productId}`).then((product) => product)
    }


    postOrder(order: IOrder): Promise<IOrderResult> {
		return this._baseApi.post<IOrderResult>(`/order/`, order, 'POST').then((res) => res);
	}
}