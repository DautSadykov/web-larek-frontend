import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/LarekAPI';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/AppData';
import { cardsTest } from './utils/tempConstants';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Contacts, Order } from './components/Order';
import { Card, CardBasket, CardPreview } from './components/Card';
import { add, iteratee } from 'lodash';
import { IContactForm, IOrderForm } from './types';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => events.emit('success:close'),
})

api
	.getProductList()
	.then((res) => {
		appData.setCatalog(res);
	})
	.catch((err) => {
		console.error(err);
	});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('preview:changed', (item: ProductItem) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:toggleProduct', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
	card.disablePriceless()
	if (appData.getOrder().items.includes(item.id)) {
		card.disableIfInBasket()
	}
});

events.on('basket:toggleProduct', (item: ProductItem) => {
	appData.toggleProductInBasket(item.id);
});

events.on('basket:changed', () => {
	basket.items = appData.getBasketList().map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:toggleProduct', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
	page.counter = appData.getBasketList().length;
	basket.total = appData.total;
	basket.selected = appData.getBasketList().length;
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: appData.order.address,
			valid: appData.validateOrder(),
			errors: [],
		}),
	});
});

events.on('order:set-card-payment', () => {
	appData.payment = 'online';
});

events.on('order:set-cash-payment', () => {
	appData.payment = 'offline';
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: appData.order.phone,
			email: appData.order.email,
			valid: appData.validateContacts(),
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
    api.orderProducts(appData.getOrder())
        .then(result => {
            modal.render({
                content: success.render({
                    total: result.total,
                }),
            });
            appData.clearOrder();
        })
        .catch(err => {
            console.error(err);
        });
});

events.on('success:close', () => {
	modal.close();
});

events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
    const { address } = errors;
    order.valid = !address
    order.errors = Object.values({address}).filter(i => !!i).join('; ');
});

events.on('contactsErrors:change', (errors: Partial<IContactForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});