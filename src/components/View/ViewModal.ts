import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ViewModal extends Component<null> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = this.container.querySelector('.modal__close')!;
        this._content = this.container.querySelector('.modal__content')!;
        
        this._closeButton.addEventListener('click', () => {
            this.close();
            this.events.emit('modal:close');
        });
        
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
                this.events.emit('modal:close');
            }
        });
        
        this._content.addEventListener('click', (event) => event.stopPropagation());
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.close();
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}