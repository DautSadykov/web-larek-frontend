import validate from "validate.js";
import { IOrder, IOrderData, IProduct, TContactModal, TOrderModal } from "../types";
import { IEvents } from "./base/events";
import { constraintsContact, constraintsOrder } from "../utils/constants";

export class OrderData implements IOrderData {
    protected items: Pick<IProduct, 'id'>[];
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected total: number;
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events
    }

    placeOrder(items: Pick<IOrder, "items">, payment: string, email: string, phone: string, address: string, total: number): void {
        this.events.emit('order:placed')
    }

    setOrderInfo(order: IOrder): void {
        this.items = order.items;
        this.payment = order.payment;
        this.email = order.email;
        this.phone = order.phone;
        this.address = order.address;
        this.total = order.total;
        this.events.emit('order:changed')
    }

    checkContactValidaton(data: Record<keyof TContactModal, string>): boolean {
        const isValid = !Boolean(validate(data, constraintsContact));
		return isValid;
    }
    
    checkOrderValidation(data: Record<keyof TOrderModal, string>): boolean {
        const isValid = !Boolean(validate(data, constraintsOrder));
        return isValid;
    }
}