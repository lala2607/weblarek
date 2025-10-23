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
            this.validateForm();
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phoneChange', { phone: this._phoneInput.value });
            this.validateForm();
        });
    }

    protected onSubmit(): void {
        if (this.validateForm()) {
            this.events.emit('contacts:submit', {
                email: this._emailInput.value,
                phone: this._phoneInput.value
            });
        }
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.validateForm();
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.validateForm();
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    private validateForm(): boolean {
        const emailValid = this.validateEmail(this._emailInput.value);
        const phoneValid = this.validatePhone(this._phoneInput.value);
        const isValid = emailValid && phoneValid;
        
        this.valid = isValid;
        
        if (!emailValid && !phoneValid) {
            this.errors = 'Укажите корректный email и телефон';
        } else if (!emailValid) {
            this.errors = 'Укажите корректный email';
        } else if (!phoneValid) {
            this.errors = 'Укажите корректный телефон';
        } else {
            this.errors = '';
        }
        
        return isValid; 
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePhone(phone: string): boolean {
        return phone.replace(/\D/g, '').length >= 11;
    }

    render(data: { email?: string; phone?: string; errors?: string }): HTMLElement {
        super.render(data);
        
        if (data.email) {
            this.email = data.email;
        }
        
        if (data.phone) {
            this.phone = data.phone;
        }
        
        if (data.errors) {
            this.errors = data.errors;
        }
        
        return this.container;
    }
}