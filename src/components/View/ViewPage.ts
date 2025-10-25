import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ViewPage extends Component<null> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    setView(view: 'catalog' | 'basket' | 'order'): void {
        this.container.setAttribute('data-view', view);
    }

    getCurrentView(): string {
        return this.container.getAttribute('data-view') || 'catalog';
    }
}