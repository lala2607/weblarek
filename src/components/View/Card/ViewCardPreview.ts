import { ViewCard } from './ViewCard.ts';
import { IProduct } from '../../../types/index.ts';
import { IEvents } from '../../base/Events.ts';

interface PreviewCardData extends IProduct {
    inBasket?: boolean;
}

export class ViewCardPreview extends ViewCard {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _text: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._description = this.container.querySelector('.card__text')!;
        this._button = this.container.querySelector('.card__button')!;
        this._category = this.container.querySelector('.card__category')!;
        this._text = this.container.querySelector('.card__text')!;
        this._button.addEventListener('click', () => {
            if (this.price === null) {
                return;
            }

            if (this._button.textContent === 'В корзину') {
                this.events.emit('card:add', { id: this.id });
            } else {
                this.events.emit('card:remove', { id: this.id });
            }

            this.events.emit('modal:close');
        });
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = this.getCategoryClass(value);
        this._category.className = `card__category ${categoryClass}`;
    }

    set text(value: string) {
        this.setText(this._text, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    render(data: Partial<PreviewCardData>): HTMLElement {
        super.render(data);
        
        if (data.description) {
            this.description = data.description;
        }

        if (data.category) {
            this.category = data.category;
        }

        if (data.inBasket !== undefined) {
            this.updateButtonState(data.inBasket, data.price !== null);
        }
        
        return this.container;
    }

    updateButtonState(inBasket: boolean, available: boolean): void {
        if (!available) {
            this.buttonText = 'Недоступно';
            this._button.disabled = true;
            this._button.style.opacity = '0.5';
            return;
        }

        this._button.disabled = false;
        this._button.style.opacity = '1';

        if (inBasket) {
            this.buttonText = 'Удалить из корзины';
        } else {
            this.buttonText = 'В корзину';
        }
    }

    private getCategoryClass(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'софт-скил': 'card__category_soft',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'хард-скил': 'card__category_hard'
        };
        
        return categoryMap[category] || 'card__category_other';
    }
}
