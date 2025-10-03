import './scss/styles.scss';
import { Products } from './components/Models/Products/Products.ts';
import { Cart } from './components/Models/Products/Cart.ts';
import { Buyer } from './components/Models/Buyers/Buyer.ts';
import { WebLarekApi } from './components/Models/WebLarekApi/WebLarekApi.ts';
import { Api } from './components/base/Api.ts'; 
import { API_URL } from './utils/constants.ts'; 
import { TPayment } from './types/index.ts';

async function loadProductsFromAPI(): Promise<any[]> {
    try {
        console.log('Загрузка товаров с API...');
        console.log('API_URL:', API_URL);
        
        const baseApi = new Api(API_URL);
        const webLarekApi = new WebLarekApi(baseApi);
        
        const productList = await webLarekApi.getProductList();
        console.log('Товары успешно загружены с сервера');
        return productList.items;
    } catch (error) {
        console.error('Ошибка при загрузке данных с сервера:', error);
        console.warn('Используем пустой массив для тестирования');
        return [];
    }
}

async function main() {
    const apiProducts = await loadProductsFromAPI();
    
    const productsModel = new Products();

    console.log('Товары:', productsModel.getItems());
    console.log('Выбранный товар:', productsModel.getSelectedProduct());

    productsModel.setItems(apiProducts);
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

    buyerModel.setPayment('card');
    buyerModel.setEmail('test@example.com');
    buyerModel.setPhone('+79999999999');
    buyerModel.setAddress('Тестовый адрес');

    const buyerData = buyerModel.getBuyerData();
    console.log('Данные покупателя (IBuyer):', buyerData);

    const validationResult1 = buyerModel.validate();
    console.log('Ошибки:', validationResult1);
    console.log('Все поля валидны:', Object.keys(validationResult1).length === 0);

    buyerModel.setPayment('' as TPayment);
    buyerModel.setEmail('');
    buyerModel.setPhone('');
    buyerModel.setAddress('');

    const validationResult2 = buyerModel.validate();
    console.log('Ошибки:', validationResult2);
    console.log('Все поля валидны:', Object.keys(validationResult2).length === 0);

    console.log('Email валиден:', !validationResult2.email);
    console.log('Адрес валиден:', !validationResult2.address);
}

main().catch(console.error);