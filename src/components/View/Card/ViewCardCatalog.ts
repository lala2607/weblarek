import { ViewCard } from './ViewCard.ts';
import { IEvents } from '../../base/Events.ts';

export class ViewCardCatalog extends ViewCard {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.id });
        });
    }
}