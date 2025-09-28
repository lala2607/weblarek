import { IProduct } from "../../../types";

export class Products {
    protected products: IProduct[];
    protected selectedProduct: IProduct | null;

    constructor() {
        this.products = [];
        this.selectedProduct = null;
    }

    getItems(): IProduct[] {
        return this.products;
    };

    setItems(items: IProduct[]): void  {
        this.products = items;
    };

    setProduct(selectedProduct: IProduct): void {
        this.selectedProduct = selectedProduct;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}