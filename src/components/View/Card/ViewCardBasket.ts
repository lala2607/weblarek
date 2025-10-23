import { ViewCard } from './ViewCard.ts';
import { IEvents } from '../../base/Events.ts';
import { IProduct } from '../../../types/index.ts';


interface BasketItemData extends IProduct {
    index?: number;
}

export class ViewCardBasket extends ViewCard {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._index = this.container.querySelector('.basket__item-index')!;
        this._deleteButton = this.container.querySelector('.basket__item-delete')!;
        this._deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            console.log('Delete button clicked, removing item:', this.id);

            this.events.emit('card:remove', { id: this.id });
        });
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    render(data: Partial<BasketItemData>): HTMLElement {
        super.render(data);
        
        if (data.index !== undefined) {
            this.index = data.index;
        }
        
        return this.container;
    }
}