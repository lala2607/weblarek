import { Component } from '../base/Component.ts';
import { IEvents } from '../base/Events.ts';

interface ViewHeaderData {
    counter: number;
}

export class ViewHeader extends Component<ViewHeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketButton = this.container.querySelector('.header__basket')!;
        this.counterElement = this.container.querySelector('.header__basket-counter')!;
        
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.counterElement, value);
    }
}