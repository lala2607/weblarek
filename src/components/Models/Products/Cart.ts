import { IProduct } from "../../../types";

export class Cart {
    private items: IProduct[];

    constructor() {
        this.items = [];
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
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
}
