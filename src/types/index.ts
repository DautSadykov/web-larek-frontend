// составляется на основе хранимых данных
export interface IProduct {
	_id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
	inBasket: boolean;
}

export interface IOrder {
	items: Pick<IProduct, '_id'>[];
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
	items: Pick<IOrder, 'items'>;
	payment: Pick<IOrder, 'payment'>;
	email: Pick<IOrder, 'email'>;
	phone: Pick<IOrder, 'phone'>;
	address: Pick<IOrder, 'address'>;
	total: Pick<IOrder, 'total'>;
	placeOrder(
		payment: string,
		email: string,
		phone: string,
		address: string,
		total: number,
		items: Pick<IOrder, 'items'>
	): void;
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
