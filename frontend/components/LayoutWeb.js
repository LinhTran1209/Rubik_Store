import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef } from 'react';
import HeaderHome from './Header/HeaderHome';
import FooterHome from './Footer/FooterHome';
import Support from './Support';
import BackTop from './BackTop';
import Script from 'next/script';


const LayoutWeb = ({ props, children }) => {

    return (
        <React.Fragment>
            <Head>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Rubik Store</title>

                {/* <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"/>

                <link rel="stylesheet" href="/assets/css/base.css"/>
                <link rel="stylesheet" href="/assets/css/index.css"/>
                <link rel="stylesheet" href="/assets/css/introduce.css"/>
                <link rel="stylesheet" href="/assets/css/news.css"/>
                <link rel="stylesheet" href="/assets/css/manualRubik.css"/>
                <link rel="stylesheet" href="/assets/css/modal_login_register.css"/>

                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"/>
                <link rel="stylesheet" href="/assets/fonts/fontawesome-free-6.5.2-web/css/all.min.css"/> */}
                <link rel="icon" href={`/faviconRubik.ico`} type="image/x-icon"></link>



            </Head>

            <div id="top-app" className="app">
                <HeaderHome />

                <div className="middle">
                    {children}
                </div>
                <FooterHome />
                <Support />
                <BackTop />
            </div>
        </React.Fragment>
    );
};

export default LayoutWeb;
