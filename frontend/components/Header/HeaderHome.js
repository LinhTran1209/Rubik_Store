import React from 'react';
import HeaderTop from './HeaderTop';
import HeaderNav from './HeaderNav';

const HeaderHome = () => {
    return (
        <header className="header">
            <HeaderTop />
            <HeaderNav />
        </header>
    );
};

export default HeaderHome;