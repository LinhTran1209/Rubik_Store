import React, { useEffect, useState } from 'react';
import SeachProduct from '../../components/SearchProduct';

const HeaderTop = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user_customer');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        // Xóa thông tin người dùng và tải lại trang
        localStorage.removeItem('user_customer');
        // window.location.reload();
        window.location.href = `/home`;
    };

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
                {user ? (
                    // Nếu đã đăng nhập, hiển thị số điện thoại và nút Đăng xuất
                    <div className="header__top-a">
                        <i className="fa-solid fa-user"></i>
                        <span>
                            <span style={{marginLeft:"10px"}}>{user.phone}</span><br />
                            <a
                                className='a-register-login'
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                                style={{textDecoration: 'none' }}
                            >
                                Đăng xuất
                            </a>
                        </span>
                    </div>
                ) : (
                    <div className="header__top-a">
                        <i className="fa-solid fa-user"></i>
                        <span>
                            <a className="a-register-login" href="/login">Đăng nhập</a><br />
                            <a className="a-register-login" href="/register">Đăng ký</a>
                        </span>
                    </div>
                )}
            </div>

            <div className="header__top-cart">
                <a className="header__top-a" href="#">
                    <span id="count-in-cart">0</span>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span style={{ lineHeight: '33px' }}>Giỏ hàng</span>
                </a>
                <div className="detail-cart">

                </div>
            </div>
        </div>
    );
};

export default HeaderTop;