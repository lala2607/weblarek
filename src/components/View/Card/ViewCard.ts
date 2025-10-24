import { Component } from '../../base/Component.ts';
import { IProduct } from '../../../types/index.ts';
import { IEvents } from '../../base/Events.ts';

export abstract class ViewCard extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string = '';

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = this.container.querySelector('.card__title') as HTMLElement;
        this._price = this.container.querySelector('.card__price') as HTMLElement;
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value === null ? 'Бесценно' : `${value} синапсов`);
    }
}