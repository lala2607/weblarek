import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ViewBasket extends Component<null> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = this.container.querySelector('.basket__list')!;
        this._total = this.container.querySelector('.basket__price')!;
        this._button = this.container.querySelector('.basket__button')!;
        
        this._button.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(value: HTMLElement[]) {
        this._list.replaceChildren(...value);
        this.setDisabled(this._button, value.length === 0);
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }
}