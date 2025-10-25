import { ViewCard } from './ViewCard.ts';
import { IEvents } from '../../base/Events.ts';
import { IProduct } from '../../../types/index.ts';
import { categoryMap, CDN_URL } from '../../../utils/constants.ts';

export class ViewCardCatalog extends ViewCard { 
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) { 
        super(container, events); 
        
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
         
        this.container.addEventListener('click', () => { 
            if (this._id) { 
                this.events.emit('card:select', { id: this._id }); 
            } 
        }); 
    } 

    set category(value: string) { 
        if (this._category && value) { 
            this._category.textContent = value; 
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other'; 
            this._category.className = `card__category ${categoryClass}`; 
        } 
    } 

    set image(value: string) { 
        if (value && this._image) { 
            const cleanPath = value.startsWith('/') ? value.slice(1) : value; 
            const fullImageUrl = CDN_URL + '/' + cleanPath; 
            this._image.src = fullImageUrl; 
            this._image.alt = this._title?.textContent || 'Изображение товара'; 
        } 
    } 

    render(product: IProduct): HTMLElement { 
        this.id = product.id; 
        this.title = product.title; 
        this.price = product.price; 
        this.category = product.category;
        this.image = product.image;
         
        return this.container; 
    } 
}