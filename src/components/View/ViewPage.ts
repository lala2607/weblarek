import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ViewPage extends Component<null> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = this.container.querySelector('.header__basket-counter')!;
        this._catalog = this.container.querySelector('.gallery')!;
        this._basket = this.container.querySelector('.header__basket')!;
        this._wrapper = this.container.querySelector('.page__wrapper')!;
      
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}