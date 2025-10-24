import { Component } from '../base/Component.ts';

interface ViewGalleryData {
    catalog: HTMLElement[];
}

export class ViewGallery extends Component<ViewGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}