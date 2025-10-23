import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Products {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.products = items;
        this.events.emit('products:changed', { items: this.products });
    }

    getItems(): IProduct[] {
        return this.products;
    }

    setProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('product:selected', { product });
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}