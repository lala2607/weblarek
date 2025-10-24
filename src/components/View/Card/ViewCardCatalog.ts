import { ViewCard } from './ViewCard.ts';
import { IEvents } from '../../base/Events.ts';
import { IProduct } from '../../../types/index.ts';
import { CDN_URL } from '../../../utils/constants.ts';

export class ViewCardCatalog extends ViewCard {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.container.addEventListener('click', () => {
            if (this.id) {
                this.events.emit('card:select', { id: this.id });
            }
        });
    }

    set price(value: number | null) {
    if (value === null) {
        this.setText(this._price, 'Бесценно');
    } else {
        this.setText(this._price, `${value} синапсов`);
    }
}
   render(product: IProduct): HTMLElement {
    this.id = product.id;
    this.title = product.title;
    this.price = product.price;
    
    const categoryElement = this.container.querySelector('.card__category') as HTMLElement;
    if (categoryElement && product.category) {
        this.setText(categoryElement, product.category);
    }

    const imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
    if (imageElement && product.image) {
        const cleanPath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
        const fullImageUrl = CDN_URL + '/' + cleanPath;
        imageElement.src = fullImageUrl;
        imageElement.alt = product.title;
    }

    

    return this.container;
}
}