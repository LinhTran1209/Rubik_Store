import React, { useState } from "react";
import Head from 'next/head';

import HeaderHome from './Header/HeaderHome';
import FooterHome from './Footer/FooterHome';
import Support from './Support';
import BackTop from './BackTop';



const LayoutWeb = ({ children }) => {

    return (
        <React.Fragment>
            <Head>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Rubik Store</title>
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
