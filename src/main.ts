import './scss/styles.scss';
import { Products } from './components/Models/Products/Products.ts';
import { Cart } from './components/Models/Products/Cart.ts';
import { Buyer } from './components/Models/Buyers/Buyer.ts';
import { apiProducts } from './utils/data';


const productsModel = new Products();

console.log('Товары:', productsModel.getItems());
console.log('Выбранный товар:', productsModel.getSelectedProduct());

productsModel.setItems(apiProducts.items);
const items = productsModel.getItems();
console.log('Загружено товаров:', items.length);
console.log('Товары:', items);


if (items.length > 0) {
    productsModel.setProduct(items[0]);
    console.log('Выбран товар:', productsModel.getSelectedProduct());
}


if (items.length > 1) {
    productsModel.setProduct(items[1]);
    console.log('Новый выбранный товар:', productsModel.getSelectedProduct());
}

console.log('Количество товаров после операций:', productsModel.getItems().length);


const cartModel = new Cart();

console.log('Количество товаров:', cartModel.getCount());
console.log('Товары:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotalPrice());

if (items.length > 0) {
    cartModel.addItem(items[0]);
    console.log('Добавлен товар:', items[0].title);
    console.log('Количество товаров:', cartModel.getCount());
}

if (items.length > 1) {
    cartModel.addItem(items[1]);
    console.log('Добавлен товар:', items[1].title);
    console.log('Количество товаров:', cartModel.getCount());
}

if (items.length > 0) {
    console.log('Товар с ID', items[0].id, 'в корзине:', cartModel.contains(items[0].id));
}

console.log('Товары:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotalPrice());


if (items.length > 0) {
    cartModel.removeItem(items[0].id);
    console.log('Удален товар:', items[0].title);
    console.log('Количество товаров после удаления:', cartModel.getCount());
    console.log('Товар с ID', items[0].id, 'в корзине:', cartModel.contains(items[0].id));
}


const buyerModel = new Buyer();

const testBuyerData = {
    payment: 'card' as const,
    email: 'test@example.com',
    phone: '+79999999999',
    address: 'Тестовый адрес'
};
buyerModel.setBuyerData(testBuyerData);


buyerModel.setPayment('cash');
buyerModel.setEmail('new@example.com');
buyerModel.setPhone('+78888888888');
buyerModel.setAddress('Новый адрес');

