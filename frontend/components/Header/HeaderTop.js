import React from 'react';
import SeachProduct from '../../components/SearchProduct'

const HeaderTop = () => {
    return (
        <div className="header__top">
            <a className="header__top-logo" href="/home">
                <img id="logo" src="/assets/img/logo.png" alt="Logo" />
            </a>

            <SeachProduct />

            <div className="header__top-contact">
                <a className="header__top-a" href="#">
                    <i className="fa-solid fa-phone-volume"></i>
                    <span>
                        <span>0344665810</span><br />
                        <span>Hotline bán hàng</span>
                    </span>
                </a>
            </div>

            <div className="header__top-user">
                <div className="header__top-a" href="#">
                    <i className="fa-solid fa-user"></i>
                    <span>
                        <a className="a-register-login" href="/login">Đăng nhập</a><br />
                        <a className="a-register-login" href="#">Đăng ký</a>
                    </span>
                </div>
            </div>

            <div className="header__top-cart">
                <a className="header__top-a" href="#">
                    <span id="count-in-cart">0</span>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span style={{ lineHeight: '33px' }}>Giỏ hàng</span>
                </a>
                <div className="detail-cart">
                    {/* <!-- <div className="empty__detail-cart">Giỏ hàng trống</div> --> */}
                </div>
            </div>
        </div>
    )

}

export default HeaderTop;