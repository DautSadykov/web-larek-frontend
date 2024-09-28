import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";


export class ProductData implements IProductsData {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    }

    set products(products: IProduct[]) {
        this._products = products;
        this.events.emit('products:changed');
    }

    get products() {
        return this._products;
    }

    set preview(productId: string | null) {
        if (!productId) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this._preview = productId;
            this.events.emit('card:selected')
        }
    }

    get preview() {
        return this._preview;
    }

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    addProductToBasket(productId: string): void {
        this._products.find((item) => item.id === productId).inBasket = true
        this.events.emit('product:toggleInBasket')
    }
    
    removeProductFromBasket(productId: string): void {
        this._products.find((item) => item.id === productId).inBasket = false
        this.events.emit('product:toggleInBasket')
    }
}



