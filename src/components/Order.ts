import {Form} from "./common/Form";
import {IContactForm, IOrderForm} from "../types";
import {IEvents} from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _cardPayment: HTMLElement;
    protected _cashPayment: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._cardPayment = container.elements.namedItem('card') as HTMLButtonElement
        this._cashPayment = container.elements.namedItem('cash') as HTMLButtonElement

        this._cardPayment.addEventListener('click', () => {
            events.emit('order:set-card-payment')
        })

        this._cashPayment.addEventListener('click', () => {
            events.emit('order:set-cash-payment')
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
    
    set payment(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}

export class Contacts extends Form<IContactForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this._submit.addEventListener('click', () => {
            events.emit('success:open')
        })
    }
    
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
    
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}