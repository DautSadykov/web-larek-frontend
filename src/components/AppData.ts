// import _ from "lodash";
import {Model} from "./base/Model";
import {FormErrors, IAppState, IContactForm, IOrder, IOrderForm, IProduct} from "../types";

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
}

export class AppState extends Model<IAppState> {
    catalog: ProductItem[];
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
        if (this.order.items.includes(id)) {
            this.order.items = this.order.items.filter(el => el !== id)
        } else {
            this.order.items = [...this.order.items, id]
        }
        this.order.total = this.getTotal()
        this.emitChanges('basket:changed', {id})
    }
    
    clearOrder() {
        this.order.items = []
        this.order.email = ''
        this.order.address = ''
        this.order.payment = 'online'
        this.order.phone = ''
        this.order.total = 0
        this.emitChanges('basket:changed')
    }
    
    getBasketList() {
        return this.catalog
        .filter(item => this.order.items.includes(item.id))
    }

    set payment(value: string) {
        this.order.payment = value
    }

    getOrder() {
        return this.order
    }

    getTotal() {
        const productsInBasket = this.catalog.filter((item) => this.order.items.includes(item.id))
        return productsInBasket.reduce((acc, curr) => acc + curr.price, 0)
    }

    get total() {
        return this.order.total
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