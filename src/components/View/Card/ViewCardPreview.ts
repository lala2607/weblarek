import { ViewCard } from './ViewCard.ts';
import { IEvents } from '../../base/Events.ts';
import { categoryMap, CDN_URL } from '../../../utils/constants.ts';
export class ViewCardPreview extends ViewCard {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._description = this.container.querySelector('.card__text') as HTMLElement;
        this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        
        this._button.addEventListener('click', () => {
            if (this._button.disabled) {
                return;
            }

            if (this._button.textContent === 'В корзину') {
                this.events.emit('card:add', { id: this.id });
            } else {
                this.events.emit('card:remove', { id: this.id });
            }
        });
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set inBasket(value: boolean) {
        if (this._button.disabled) {
            return;
        }

        if (value) {
            this._button.textContent = 'Удалить из корзины';
        } else {
            this._button.textContent = 'В корзину';
        }
    }

    set image(value: string) {
        if (value && this._image) {
            const cleanPath = value.startsWith('/') ? value.slice(1) : value;
            const fullImageUrl = CDN_URL + '/' + cleanPath;
            this._image.src = fullImageUrl;
            this._image.alt = this.title || 'Изображение товара';
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            this._button.textContent = 'Недоступно';
            this.setDisabled(this._button, true);
            this._button.classList.add('card__button_disabled');
        } else {
            this.setText(this._price, `${value} синапсов`);
            this.setDisabled(this._button, false);
            this._button.classList.remove('card__button_disabled');
        }
    }
}