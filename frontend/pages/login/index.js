import React, { useContext, useRef, useState } from "react";
import HeaderHome from "../../components/Header/HeaderHome";
import FooterHome from "../../components/Footer/FooterHome";
import MiddleLogin from "../../components/Middle/MiddleLogin";


import Support from '../../components/Support'
import BackTop from '../../components/BackTop'

import AppConfig from "../../layout/AppConfig";



const HomePage = () => {
    return (
        <div id="top-app" className="app">
            <HeaderHome />
            <MiddleLogin />
            <FooterHome />
            <Support />
            <BackTop />
        </div>

    );
};

HomePage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};

export default HomePage;
