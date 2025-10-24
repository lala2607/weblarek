import { ViewForm } from './ViewForm.ts';
import { IEvents } from '../../base/Events.ts';

export class ViewContactsForm extends ViewForm {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._emailInput = this.container.querySelector('input[name="email"]')!;
        this._phoneInput = this.container.querySelector('input[name="phone"]')!;
        
        this._emailInput.addEventListener('input', () => {
            this.events.emit('contacts:emailChange', { email: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phoneChange', { phone: this._phoneInput.value });
        });
    }

    protected onSubmit(): void {
        this.events.emit('contacts:submit');
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}