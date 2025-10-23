import { Component } from '../base/Component.ts';

interface ViewGalleryData {
    catalog: HTMLElement[];
}

export class ViewGallery extends Component<ViewGalleryData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = this.container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}