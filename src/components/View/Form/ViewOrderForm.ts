import { ViewForm } from './ViewForm.ts';
import { TPayment } from '../../../types/index.ts';
import { IEvents } from '../../base/Events.ts';

export class ViewOrderForm extends ViewForm {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = this.container.querySelectorAll('button[name]');
        this._addressInput = this.container.querySelector('input[name="address"]')!;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.events.emit('order:paymentChange', { payment });
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.events.emit('order:addressChange', { address: this._addressInput.value }); 
        });
    }

    protected onSubmit(): void {
        this.events.emit('order:submit'); 
    }

    set payment(value: TPayment) {
        this._paymentButtons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}