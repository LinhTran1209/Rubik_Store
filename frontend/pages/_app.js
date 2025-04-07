import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout'; // layout này là layout mặc định của PrimeReact cho trang quản lý 
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import '../styles/css/base.css';
import '../styles/css/index.css';
import '../styles/css/introduce.css';
import '../styles/css/news.css';
import '../styles/css/manualRubik.css';
import '../styles/css/modal_login_register.css';
import '../styles/css/detail_product.css';
import '../styles/css/rubik2x2x2.css';
import '../styles/css/account.css';
import '../styles/css/cart_hover.css';
import '../styles/css/cart.css';
import '../styles/css/user_address.css';
import '../styles/css/order.css';
import '../styles/css/checkout.css';

import { CartProvider } from "../components/CartContext";
import { UserProvider } from "../components/UserContext";


//LayoutWeb này là layout cho trang web bán hàng
import LayoutWeb from '../components/LayoutWeb';
import LayoutCheckout from '../components/LayoutCheckout';

export default function MyApp({ Component, pageProps }) {


    if (Component.getLayoutWeb) {
        return (
            <UserProvider>
                <CartProvider>
                    <LayoutWeb>
                        <Component {...pageProps} />
                    </LayoutWeb>
                </CartProvider>
            </UserProvider>
        )
    }

    if (Component.getLayoutCheckout) {
        return (
            <UserProvider>
                <CartProvider>
                    <LayoutCheckout>
                        <Component {...pageProps} />
                    </LayoutCheckout>
                </CartProvider>
            </UserProvider>
        )
    }

    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <UserProvider>
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            </UserProvider>
        );
    }
}