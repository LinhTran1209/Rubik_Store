import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout'; // layout này là layout mặc định của PrimeReact cho trang quản lý 
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import '../public/assets/css/index.css';

//LayoutWeb này là layout cho trang web bán hàng
import LayoutWeb from '../components/LayoutWeb';



export default function MyApp({ Component, pageProps }) {


    if (Component.getLayoutWeb) {
        return (
            <LayoutWeb>
                <Component {...pageProps} />
            </LayoutWeb>
        )
    }

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

    // return (
    //     <Router>
    //         <dir clasName="App">
    //             <Routes>



    //             </Routes>
    //         </dir>
    //     </Router>
    // )
}