import { IBuyer, TPayment } from "../../../types";
import { IEvents } from "../../base/Events";

export class Buyer {
    private buyer: IBuyer = {
        payment: '' as TPayment,
        email: '',
        phone: '',
        address: ''
    };

    constructor(protected events: IEvents) {}

    setPayment(payment: TPayment): void {
        this.buyer.payment = payment;
        this.events.emit('buyer:changed', { buyer: this.buyer });
    }

    setEmail(email: string): void {
        this.buyer.email = email;
        this.events.emit('buyer:changed', { buyer: this.buyer });
    }

    setPhone(phone: string): void {
        this.buyer.phone = phone;
        this.events.emit('buyer:changed', { buyer: this.buyer });
    }

    setAddress(address: string): void {
        this.buyer.address = address;
        this.events.emit('buyer:changed', { buyer: this.buyer });
    }

    validateOrder(): { [key: string]: string } {
        const errors: { [key: string]: string } = {};
        
        if (!this.buyer.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.buyer.address) errors.address = 'Не указан адрес';
        
        return errors;
    }

    validateContacts(): { [key: string]: string } {
        const errors: { [key: string]: string } = {};
        
        if (!this.buyer.email) errors.email = 'Не указан email';
        else if (!this.validateEmail(this.buyer.email)) errors.email = 'Некорректный email';
        
        if (!this.buyer.phone) errors.phone = 'Не указан телефон';
        else if (!this.validatePhone(this.buyer.phone)) errors.phone = 'Некорректный телефон';
        
        return errors;
    }

    validate(): { [key: string]: string } {
        return {
            ...this.validateOrder(),
            ...this.validateContacts()
        };
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePhone(phone: string): boolean {
        return phone.replace(/\D/g, '').length >= 11;
    }

    getBuyerData(): IBuyer {
        return { ...this.buyer };
    }

    clear(): void {
        this.buyer = {
            payment: '' as TPayment,
            email: '',
            phone: '',
            address: ''
        };
    }
}