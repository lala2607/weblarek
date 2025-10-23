import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ViewSuccess extends Component<{ total: number }> {
    protected _total: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._total = this.container.querySelector('.order-success__description')!;
        this._closeButton = this.container.querySelector('.order-success__close')!;
        
        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}