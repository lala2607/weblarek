import { Component } from '../../base/Component.ts';
import { IProduct } from '../../../types/index.ts';
import { CDN_URL, categoryMap } from '../../../utils/constants.ts';
import { IEvents } from '../../base/Events.ts';

export abstract class ViewCard extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = this.container.querySelector('.card__title')!;
        this._price = this.container.querySelector('.card__price')!;
        
        this._category = this.container.querySelector('.card__category') || undefined;
        this._image = this.container.querySelector('.card__image') || undefined;
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

    set price(value: number | null) {
        this.setText(this._price, value === null ? 'Бесценно' : `${value} синапсов`);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            Object.entries(categoryMap).forEach(([cat, className]) => {
                this._category!.classList.remove(className);
            });
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this._category.classList.add(categoryClass);
            }
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, CDN_URL + value, this._title.textContent || '');
        }
    }
}