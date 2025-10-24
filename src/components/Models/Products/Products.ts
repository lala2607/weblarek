import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Products {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.products = items;
        console.log('Products loaded:', this.products.length);
        this.events.emit('products:changed', { items: this.products });
    }

    getItems(): IProduct[] {
        return this.products;
    }

    setProduct(product: IProduct): void {
        this.selectedProduct = product;
        console.log('Product set for preview:', product.title);
        this.events.emit('product:selected', { product });
    }
}