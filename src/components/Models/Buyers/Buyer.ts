import { IBuyer, TPayment } from "../../../types";

export class Buyer {
    private buyer: IBuyer;

    constructor() {
        this.buyer = {
            payment: '' as TPayment,
            email: '',
            phone: '',
            address: ''
        };
    }

    setPayment(payment: TPayment) {
        this.buyer.payment = payment;
    }

    setEmail(email: string) {
        this.buyer.email = email;
    }

    setPhone(phone: string) {
        this.buyer.phone = phone;
    }

    setAddress(address: string) {
        this.buyer.address = address;
    }

    validate(): { [key: string]: string } {
        const errors: { [key: string]: string } = {};

        if (!this.buyer.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.buyer.email) {
            errors.email = 'Не указан email';
        }

        if (!this.buyer.phone) {
            errors.phone = 'Не указан телефон';
        }

        if (!this.buyer.address) {
            errors.address = 'Не указан адрес';
        }

        return errors;
    }

    getBuyerData(): IBuyer {
        return { ...this.buyer };
    }
}