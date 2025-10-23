import { ViewForm } from './ViewForm.ts';
import { TPayment } from '../../../types/index.ts';
import { IEvents } from '../../base/Events.ts';

export class ViewOrderForm extends ViewForm {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;
    protected _selectedPayment: TPayment | null = null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = this.container.querySelectorAll('button[name]');
        this._addressInput = this.container.querySelector('input[name="address"]')!;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.setPayment(payment);
                this.events.emit('order:paymentChange', { payment });
                this.validateForm();
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.events.emit('order:addressChange', { address: this._addressInput.value });
            this.validateForm();
        });
    }

    protected onSubmit(): void {

        if (this.validateForm()) {
            this.events.emit('order:submit', {
                payment: this._selectedPayment!,
                address: this._addressInput.value
            });
        }
    }

    set payment(value: TPayment) {
        this.setPayment(value);
        this.validateForm();
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.validateForm();
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    private setPayment(value: TPayment): void {
        this._selectedPayment = value;
        this._paymentButtons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    private validateForm(): boolean {
        const hasPayment = !!this._selectedPayment;
        const hasAddress = this._addressInput.value.trim().length > 0;
        const isValid = hasPayment && hasAddress;
        
        this.valid = isValid;

        if (!hasPayment && !hasAddress) {
            this.errors = 'Выберите способ оплаты и укажите адрес';
        } else if (!hasPayment) {
            this.errors = 'Выберите способ оплаты';
        } else if (!hasAddress) {
            this.errors = 'Укажите адрес доставки';
        } else {
            this.errors = '';
        }
        
        return isValid; 
    }

    render(data: { payment?: TPayment; address?: string; errors?: string }): HTMLElement {
        super.render(data);
        
        if (data.payment) {
            this.payment = data.payment;
        }
        
        if (data.address) {
            this.address = data.address;
        }
        
        if (data.errors) {
            this.errors = data.errors;
        }
        
        return this.container;
    }
}