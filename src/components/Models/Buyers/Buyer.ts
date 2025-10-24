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
        this.events.emit('buyer:changed', { field: 'payment' });
    }

    setEmail(email: string): void {
        this.buyer.email = email;
        this.events.emit('buyer:changed', { field: 'email' });
    }

    setPhone(phone: string): void {
        this.buyer.phone = phone;
        this.events.emit('buyer:changed', { field: 'phone' }); 
    }

    setAddress(address: string): void {
        this.buyer.address = address;
        this.events.emit('buyer:changed', { field: 'address' });
    }

    validate(): { [key: string]: string } {
        const errors: { [key: string]: string } = {};

        if (!this.buyer.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.buyer.address?.trim()) {
            errors.address = 'Не указан адрес';
        }

        if (!this.buyer.email?.trim()) {
            errors.email = 'Не указан email';
        }

        if (!this.buyer.phone?.trim()) {
            errors.phone = 'Не указан телефон';
        }

        return errors;
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