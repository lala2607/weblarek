import { IBuyer, TPayment } from "../../../types";

export class Buyer {
    private buyerData: IBuyer;

    constructor() {
        this.buyerData = {
            payment: '' as TPayment,
            email: '',
            phone: '',
            address: ''
        }
    }

    setBuyerData(allDataBuyer: IBuyer) {
    this.buyerData = allDataBuyer;
  } // сохранение данных в модели, общий метод

  setPayment(payment: TPayment) {
    this.buyerData.payment = payment;
  }

  setEmail(email: string) {
    this.buyerData.email = email;
  }

  setPhone(phone: string) {
    this.buyerData.phone = phone;
  }

  setAddress(address: string) {
    this.buyerData.address = address;
  } // отдельные методы для каждого поля
}