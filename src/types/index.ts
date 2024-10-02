// составляется на основе хранимых данных
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	items: string[];
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}