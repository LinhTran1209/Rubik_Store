import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import '../public/assets/css/base.css';
import '../public/assets/css/index.css';
import '../public/assets/css/introduce.css';
import '../public/assets/css/news.css'
import '../public/assets/css/manualRubik.css'
import '../public/assets/fonts/fontawesome-free-6.5.2-web/css/all.min.css';
// import '../public/assets/css/modal_login_register.css';

import {LayoutWeb} from '../components/LayoutWeb'


export default function MyApp({ Component, pageProps }) {

    // if (Component.getLayoutWeb) {
    //     return <LayoutWeb>{Component.getLayoutWeb(<Component {...pageProps} />)}</LayoutWeb>;
    // }


    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}

// export default function MyApp({ Component, pageProps }) {

//     <Layout>
//         <Component {...pageProps} />
//     </Layout>

// }
