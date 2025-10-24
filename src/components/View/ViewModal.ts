import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ViewModal extends Component<null> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _handleEscape: (event: KeyboardEvent) => void;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = this.container.querySelector('.modal__close')!;
        this._content = this.container.querySelector('.modal__content')!;
        
        this._handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.close();
            }
        };

        this._closeButton.addEventListener('click', () => {
            this.close();
        });
        
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._handleEscape);
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this._handleEscape);
    }
}
