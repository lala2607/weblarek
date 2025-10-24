import { ViewCard } from './ViewCard.ts';
import { IEvents } from '../../base/Events.ts';

export class ViewCardBasket extends ViewCard {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._index = this.container.querySelector('.basket__item-index') as HTMLElement;
        this._deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
        this._deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            console.log('Delete button clicked, removing item:', this.id);
            this.events.emit('card:remove', { id: this.id });
        });
    }

    set index(value: number) {
        if (value !== undefined) {
            this.setText(this._index, value.toString());
        }
    }
}