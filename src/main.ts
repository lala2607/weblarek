import { EventEmitter, IEvents } from './components/base/Events.ts';
import { Products } from './components/Models/Products/Products.ts';
import { Cart } from './components/Models/Products/Cart.ts';
import { Buyer } from './components/Models/Buyers/Buyer.ts';
import { WebLarekApi } from './components/Models/WebLarekApi/WebLarekApi.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { cloneTemplate } from './utils/utils.ts';
import { IProduct } from './types/index.ts';
import { ViewHeader } from './components/View/ViewHeader.ts';
import { ViewBasket } from './components/View/ViewBasket.ts';
import { ViewGallery } from './components/View/ViewGallery.ts';
import { ViewModal } from './components/View/ViewModal.ts';
import { ViewCardCatalog } from './components/View/Card/ViewCardCatalog.ts';
import { ViewCardPreview } from './components/View/Card/ViewCardPreview.ts';
import { ViewCardBasket } from './components/View/Card/ViewCardBasket.ts';
import { ViewOrderForm } from './components/View/Form/ViewOrderForm.ts';
import { ViewContactsForm } from './components/View/Form/ViewContactsForm.ts';
import { ViewSuccess } from './components/View/ViewSuccess.ts';
import { TPayment } from './types/index.ts';
import './scss/styles.scss';

const events: IEvents = new EventEmitter();

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

const header = new ViewHeader(document.querySelector('.header')!, events);
const gallery = new ViewGallery(document.querySelector('.gallery')!);
const modal = new ViewModal(document.getElementById('modal-container')!, events);

const basketView = new ViewBasket(cloneTemplate(basketTemplate), events);
const orderFormView = new ViewOrderForm(cloneTemplate(orderTemplate), events);
const contactsFormView = new ViewContactsForm(cloneTemplate(contactsTemplate), events);

events.on('products:changed', () => {
    const products = productsModel.getItems();
    const cards = products.map(product => {
        const card = new ViewCardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render(product);
    });
    gallery.catalog = cards;
});

events.on('product:selected', (data: { product: IProduct }) => {
    const preview = new ViewCardPreview(cloneTemplate(cardPreviewTemplate), events);
    const inBasket = cartModel.contains(data.product.id);
    
    preview.id = data.product.id;
    preview.title = data.product.title;
    preview.price = data.product.price;
    preview.description = data.product.description || '';
    preview.category = data.product.category || '';
    preview.image = data.product.image || '';
    preview.inBasket = inBasket;
    
    modal.content = preview.render();
    modal.open();
});

events.on('cart:changed', () => {
    header.counter = cartModel.getCount();

    const items = cartModel.getItems().map((item, index) => {
        const card = new ViewCardBasket(cloneTemplate(cardBasketTemplate), events);
        card.id = item.id;
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card.render();
    });
    
    basketView.items = items;
    basketView.total = cartModel.getTotalPrice();
});

events.on('buyer:changed', () => {
    const errors = buyerModel.validate();
    const buyerData = buyerModel.getBuyerData();

    orderFormView.payment = buyerData.payment;

    orderFormView.valid = !errors.payment && !errors.address;
    contactsFormView.valid = !errors.email && !errors.phone;
});

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getItems().find(item => item.id === data.id);
    if (product) {
        productsModel.setProduct(product);
    }
});

events.on('card:add', (data: { id: string }) => {
    const product = productsModel.getItems().find(item => item.id === data.id);
    if (product) {
        cartModel.addItem(product);
        modal.close();
    }
});


events.on('card:remove', (data: { id: string }) => {
    cartModel.removeItem(data.id);
    modal.close();
});

events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

events.on('basket:order', () => {
    const buyerData = buyerModel.getBuyerData();
    modal.content = orderFormView.render({
        payment: buyerData.payment,
        address: buyerData.address
    });
    
    const errors = buyerModel.validate();
    orderFormView.valid = !errors.payment && !errors.address;
    
    modal.open();
});

events.on('order:submit', () => {
    const errors = buyerModel.validate();
    const orderErrors = {
        payment: errors.payment,
        address: errors.address
    };
    
    if (!orderErrors.payment && !orderErrors.address) {
        const buyerData = buyerModel.getBuyerData();
        contactsFormView.email = buyerData.email;
        contactsFormView.phone = buyerData.phone;
        
        const contactsErrors = {
            email: errors.email,
            phone: errors.phone
        };
        contactsFormView.valid = !contactsErrors.email && !contactsErrors.phone;
        
        modal.content = contactsFormView.render();
    } else {
        modal.content = orderFormView.render({
            payment: buyerModel.getBuyerData().payment,
            address: buyerModel.getBuyerData().address,
            errors: Object.values(orderErrors).filter(Boolean).join(', ')
        });
    }
});

events.on('order:paymentChange', (data: { payment: TPayment }) => {
    buyerModel.setPayment(data.payment);
});

events.on('order:addressChange', (data: { address: string }) => {
    buyerModel.setAddress(data.address);
});

events.on('contacts:emailChange', (data: { email: string }) => {
    buyerModel.setEmail(data.email);
});

events.on('contacts:phoneChange', (data: { phone: string }) => {
    buyerModel.setPhone(data.phone);
});

events.on('contacts:submit', async () => {
    const errors = buyerModel.validate();
    const contactsErrors = {
        email: errors.email,
        phone: errors.phone
    };
    
    if (!contactsErrors.email && !contactsErrors.phone) {
        try {
            const total = cartModel.getTotalPrice();
            const orderResult = await larekApi.createOrder({
                ...buyerModel.getBuyerData(),
                items: cartModel.getItems().map(item => item.id),
                total: total
            });

            const success = new ViewSuccess(cloneTemplate(successTemplate), events);
            success.total = orderResult.total;
            modal.content = success.render();

            cartModel.clear();
            buyerModel.clear();

        } catch (error) {
            console.error('Order error:', error);
            modal.content = contactsFormView.render({
                email: buyerModel.getBuyerData().email,
                phone: buyerModel.getBuyerData().phone,
                errors: 'Ошибка при оформлении заказа'
            });
        }
    } else {
        modal.content = contactsFormView.render({
            email: buyerModel.getBuyerData().email,
            phone: buyerModel.getBuyerData().phone,
            errors: Object.values(contactsErrors).filter(Boolean).join(', ')
        });
    }
});

events.on('success:close', () => {
    modal.close();
});

async function init() {
    try {
        const productList = await larekApi.getProductList();
        productsModel.setItems(productList.items);
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

init();