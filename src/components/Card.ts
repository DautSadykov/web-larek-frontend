import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
    category: string;
    price: number;
    inBasket: boolean;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = container.querySelector('.card__image')
        this._button = container.querySelector(`.gallery__item`);
        this._description = container.querySelector(`.card__text`);
        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }
    
    get title(): string {
        return this._title.textContent || '';
    }
    
    set category(value: string) {
        this.setText(this._category, value);
        if (value == "софт-скил") {
            this._category.classList.add('card__category_soft')
        } else if (value == "хард-скил") {
            this._category.classList.add('card__category_hard')
        } else if (value == "кнопка") {
            this._category.classList.add('card__category_button')
        } else if (value == "дополнительное") {
            this._category.classList.add('card__category_additional')
        } else {
            this._category.classList.add('card__category_other')
        }
    }
    
    set price(value: string) {
        if (value) {
            this.setText(this._price, value + ' синапсов');
        } else {
            this.setText(this._price, 'Бесценно');
        }
    }
    
    get category(): string {
        return this._category.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }
}

export class CardPreview extends Card<HTMLElement> {
    protected _addToBasket: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._addToBasket = ensureElement<HTMLButtonElement>(`.card__button`, container);
        this._addToBasket.addEventListener('click', actions.onClick);
        this._addToBasket.addEventListener('click', () => {
            this.setDisabled(this._addToBasket, true)
        });
    }

    disablePriceless() {
        if (this._price.textContent == 'Бесценно') {
            this.setDisabled(this._addToBasket, true)
        }
    }
    
    disableIfInBasket() {
        this.setDisabled(this._addToBasket, true)
    }
}

export class CardBasket extends Card<HTMLElement> {
    protected _removeFromBasket: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container)
        this._removeFromBasket = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
        this._removeFromBasket.addEventListener('click', actions.onClick)
    }
}