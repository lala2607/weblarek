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
import './scss/_variables.scss'
import './scss/styles.scss'
import './scss/mixins/_background.scss'
import './scss/mixins/_container.scss'
import './scss/mixins/_fix.scss'
import './scss/mixins/_icon.scss'
import './scss/mixins/_index.scss'
import './scss/mixins/_interactive.scss'

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

const showBasket = () => {
    const basket = new ViewBasket(cloneTemplate(basketTemplate), events);
    const items = cartModel.getItems().map((item, index) => {
        const card = new ViewCardBasket(cloneTemplate(cardBasketTemplate), events);
        return card.render({ ...item, index: index + 1 });
    });
    basket.items = items;
    basket.total = cartModel.getTotalPrice();
    modal.content = basket.render();
    modal.open();
};

events.on('products:changed', (data: { items: IProduct[] }) => {
    const cards = data.items.map(product => {
        const card = new ViewCardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render(product);
    });
    gallery.catalog = cards;
});

events.on('cart:changed', (data: { count: number }) => {
    header.counter = data.count;
});

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getItems().find(item => item.id === data.id);
    if (product) {
        const preview = new ViewCardPreview(cloneTemplate(cardPreviewTemplate), events);
        const inBasket = cartModel.contains(data.id);
        modal.content = preview.render({ ...product, inBasket });
        modal.open();
    }
});

events.on('card:add', (data: { id: string }) => {
    const product = productsModel.getItems().find(item => item.id === data.id);
    if (product) {
        cartModel.addItem(product);
    }
});

events.on('card:remove', (data: { id: string }) => {
    console.log('Removing item from cart:', data.id);

    cartModel.removeItem(data.id);

    if (cartModel.getCount() > 0) {
        const basket = new ViewBasket(cloneTemplate(basketTemplate), events);
        const items = cartModel.getItems().map((item, index) => {
            const card = new ViewCardBasket(cloneTemplate(cardBasketTemplate), events);
            return card.render({ ...item, index: index + 1 });
        });
        basket.items = items;
        basket.total = cartModel.getTotalPrice();
        modal.content = basket.render();
    } else {
        modal.close();
    }
});

events.on('basket:open', showBasket);

events.on('basket:order', () => {
    const orderForm = new ViewOrderForm(cloneTemplate(orderTemplate), events);
    modal.content = orderForm.render({
        payment: buyerModel.getBuyerData().payment,
        address: buyerModel.getBuyerData().address
    });
    modal.open();
});

events.on('order:paymentChange', (data: { payment: TPayment }) => {
    buyerModel.setPayment(data.payment);
});

events.on('order:addressChange', (data: { address: string }) => {
    buyerModel.setAddress(data.address);
});

events.on('order:submit', (data: { payment: TPayment; address: string }) => {
    const errors = buyerModel.validateOrder();
    if (Object.keys(errors).length === 0) {
        const contactsForm = new ViewContactsForm(cloneTemplate(contactsTemplate), events);
        modal.content = contactsForm.render({
            email: buyerModel.getBuyerData().email,
            phone: buyerModel.getBuyerData().phone
        });
    } else {
        const orderForm = new ViewOrderForm(cloneTemplate(orderTemplate), events);
        modal.content = orderForm.render({
            payment: data.payment,
            address: data.address,
            errors: Object.values(errors).join(', ')
        });
    }
});

events.on('contacts:emailChange', (data: { email: string }) => {
    buyerModel.setEmail(data.email);
});

events.on('contacts:phoneChange', (data: { phone: string }) => {
    buyerModel.setPhone(data.phone);
});

events.on('contacts:submit', async (data: { email: string; phone: string }) => {
    const errors = buyerModel.validateContacts();
    if (Object.keys(errors).length === 0) {
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
            const contactsForm = new ViewContactsForm(cloneTemplate(contactsTemplate), events);
            modal.content = contactsForm.render({
                email: data.email,
                phone: data.phone,
                errors: 'Ошибка при оформлении заказа'
            });
        }
    } else {
        const contactsForm = new ViewContactsForm(cloneTemplate(contactsTemplate), events);
        modal.content = contactsForm.render({
            email: data.email,
            phone: data.phone,
            errors: Object.values(errors).join(', ')
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