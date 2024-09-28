// составляется на основе хранимых данных
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	inBasket?: boolean;
}

export interface IOrder {
	items: Pick<IProduct, 'id'>[];
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
}

// составляется на основе коллекций
export interface IProductsData {
	products: IProduct[];
	preview: string | null;
	getProduct(productId: string): IProduct;
	addProductToBasket(productId: string): void;
	removeProductFromBasket(productId: string): void;
}

export interface IOrderData {
	placeOrder(
		items: Pick<IOrder, 'items'>,
		payment: string,
		email: string,
		phone: string,
		address: string,
		total: number,
	): void;
	checkOrderValidation(data: Record<keyof TOrderModal, string>): boolean;
	checkContactValidaton(data: Record<keyof TContactModal, string>): boolean;
	setOrderInfo(order: IOrder): void;
}

// составляется на основе страниц
export type TGeneralInfo = Pick<IOrder, 'items'>;
export type TProductModal = Pick<
	IProduct,
	'title' | 'image' | 'category' | 'price' | 'description'
>;
export type TBasketModal = Pick<IOrder, 'items' | 'total'>;
export type TOrderModal = Pick<IOrder, 'payment' | 'address'>;
export type TContactModal = Pick<IOrder, 'email' | 'phone'>;
export type TFinishModal = Pick<IOrder, 'total'>;
