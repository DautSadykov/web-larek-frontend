// составляется на основе хранимых данных
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IContactForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}

export interface IOrderResult {
    id: string,
	total: number
}

