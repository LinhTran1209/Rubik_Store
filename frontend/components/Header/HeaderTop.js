import React, { useEffect, useState, useRef } from 'react';
import SearchProduct from '../../components/SearchProduct';
import authService from '../../services/authService';
import { Toast } from "primereact/toast";
import Link from 'next/link';

const HeaderTop = () => {
    const [user, setUser] = useState({ phone: "", role: "" });
    const [loading, setLoading] = useState(true); 
    const toast = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUser({ phone: user.phone, role: user.role });
            } catch (error) {
                console.error("Không lấy được người dùng gần đây:", error);
                setUser({ phone: "", role: "" });
            } finally {
                setLoading(false); 
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Đăng xuất thành công",
                    life: 30000,
                });
            }
            window.location.href = "/home";
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Đăng xuất thất bại, vui lòng thử lại.");
        }
    };


    if (loading) {
        return <div className="header__top">Đang tải...</div>; 
    }

    return (
        <div className="header__top">
            <Toast ref={toast} />
            <Link href="/home" className="header__top-logo">
                <img id="logo" src="/assets/img/logo.png" alt="Logo" />
            </Link>

            <SearchProduct />

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
                {user.role === "admin" ? (
                    <div className="header__top-a">
                        <i className="fa-solid fa-user"></i>
                        <span style={{ marginTop: '24%' }}>Admin</span>
                    </div>
                ) : user.role === "customer" ? (
                    <div className="header__top-a">
                        <i className="fa-solid fa-user"></i>
                        <span>
                            <span style={{ marginLeft: "10px" }}>{user.phone}</span><br />
                            <Link
                                className="a-register-login"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                                style={{ textDecoration: "none" }}
                            >
                                Đăng xuất
                            </Link>
                        </span>
                    </div>
                ) : (
                    <div className="header__top-a">
                        <i className="fa-solid fa-user"></i>
                        <span>
                            <Link className="a-register-login" href="/login">Đăng nhập</Link><br />
                            <Link className="a-register-login" href="/register">Đăng ký</Link>
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
                <div className="detail-cart"></div>
            </div>
        </div>
    );
};

export default HeaderTop;