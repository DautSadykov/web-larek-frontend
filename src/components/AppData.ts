// import _ from "lodash";
import {Model} from "./base/Model";
import {FormErrors, IAppState, IContactForm, IOrder, IOrderForm, IProduct} from "../types";
import { ConcatenationScope } from "webpack";

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

export class ProductItem extends Model<IProduct> {
    description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    category: string;
    inBasket: boolean = false;
}

export class AppState extends Model<IAppState> {
    catalog: ProductItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        address: '',
        payment: 'online',
        phone: '',
        items: [],
        total: 0,
    };
    preview: string | null;
    formErrors: FormErrors = {};

    toggleProductInBasket(id: string) {
        this.catalog.find(item => item.id === id).inBasket = !this.catalog.find(item => item.id === id).inBasket
        this.emitChanges('basket:changed', {basket: this.basketList})
    }
    
    clearBasket() {
        this.catalog.forEach((item) => {
            item.inBasket = false
        })
        this.emitChanges('basket:changed', {basket: this.basketList})
    }

    checkProductInBasket(id: string) {
        return this.catalog.find(item => item.id === id).inBasket
    }

    get basketList() {
        return this.catalog
        .filter(item => item.inBasket === true)
    }

    set payment(value: string) {
        this.order.payment = value
    }

    setOrderData() {
        const orderItems = this.catalog.filter((item) => item.inBasket == true)
        this.order.items = orderItems.map(item => item.id)
        this.order.total = this.getTotal()
    }

    getOrder() {
        return this.order
    }

    getTotal() {
        const productsInBasket = this.catalog.filter((item) => item.inBasket == true)
        return productsInBasket.reduce((acc, curr) => acc + curr.price, 0)
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.validateOrder()
    }

    setContactsField(field: keyof IContactForm, value: string) {
        this.order[field] = value;
        this.validateContacts()
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactsErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}