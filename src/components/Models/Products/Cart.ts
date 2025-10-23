import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Cart {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('cart:changed', { 
            items: this.items, 
            count: this.items.length,
            total: this.getTotalPrice()
        });
    }

    removeItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.events.emit('cart:changed', { 
            items: this.items, 
            count: this.items.length,
            total: this.getTotalPrice()
        });
    }

    getCount(): number {
        return this.items.length;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    contains(itemId: string): boolean {
        return this.items.some(item => item.id === itemId);
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed', { 
            items: this.items, 
            count: 0,
            total: 0
        });
    }
}