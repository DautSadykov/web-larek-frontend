// составляется на основе хранимых данных
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
}

// export interface IBasket {
// 	items: string[];
// 	tital: number;
// }

// export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>

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
    loading: boolean;
}

// составляется на основе коллекций

// export interface IProductsData {
// 	products: IProduct[];
// 	preview: string | null;
// 	getProduct(productId: string): IProduct;
// 	addProductToBasket(productId: string): void;
// 	removeProductFromBasket(productId: string): void;
// }

// export interface IOrderData {
// 	items: Pick<IOrder, 'items'>;
// 	payment: Pick<IOrder, 'payment'>;
// 	email: Pick<IOrder, 'email'>;
// 	phone: Pick<IOrder, 'phone'>;
// 	address: Pick<IOrder, 'address'>;
// 	total: Pick<IOrder, 'total'>;
// 	placeOrder(
// 		payment: string,
// 		email: string,
// 		phone: string,
// 		address: string,
// 		total: number,
// 		items: Pick<IOrder, 'items'>
// 	): void;
// }

// составляется на основе страниц
// export type TGeneralInfo = Pick<IOrder, 'items'>;
// export type TProductModal = Pick<
// 	IProduct,
// 	'title' | 'image' | 'category' | 'price' | 'description'
// >;
// export type TBasketModal = Pick<IOrder, 'items' | 'total'>;
// export type TOrderModal = Pick<IOrder, 'payment' | 'address'>;
// export type TContactModal = Pick<IOrder, 'email' | 'phone'>;
// export type TFinishModal = Pick<IOrder, 'total'>;

export interface IOrderResult {
    id: string,
	total: number
}

