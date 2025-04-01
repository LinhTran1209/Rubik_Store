import React, { useEffect, useState, useRef } from 'react';
import SearchProduct from '../../components/SearchProduct';
import authService from '../../services/authService';
import cartService from '../../services/cartService';
import userService from '../../services/userService'
import productService from '../../services/productService'
import CustomToast from '../CustomToast';
import Link from 'next/link';

const HeaderTop = () => {
    // Lấy thông tin người dùng đã đăng nhập từ token chỉ có phone và role
    const [userRole, setUserRole] = useState({ phone: "", role: "" });
    const [loading, setLoading] = useState(true); 
    const toast = useRef(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUserRole({ phone: user.phone, role: user.role });
            } catch (error) {
                setUserRole({ phone: "", role: "" });
            } finally {
                setLoading(false); 
            }
        };
        fetchUserRole();
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
            alert("Đăng xuất thất bại, vui lòng thử lại.");
        }
    };

    // Lấy chính xác được user từ userRole bằng số phone
    const [user, setUser] = useState({id_user: null, role: '', name: '', email: '', phone: ''})
    const fetchUser = async () => {
        try {
            const user = await userService.getData("phone", userRole.phone)
            setUser(user[0]);
        } catch (err) {
            console.log(err.message, 'ở HeaderTop')
        }
    }

    // Lấy thông tin giỏ hàng của khách hàng (dùng cartService)
    const [ carts, setCart] = useState({id_user: null, id_product: null, quantity: '', price: '', created_at: '', updated_at: ''})
    const fetchCarts = async () => {
        try {
            const carts = await cartService.getById(user.id_user);
            setCart(carts);
            fetchProducts(carts);
        } catch (err) {
            console.log(err.message, 'ở HeaderTop');
            setLoading(false);
        }
    };

    // được mount vào khi tìm thấy người dùng gần 
    useEffect(() => {
        if (userRole) {
            fetchUser();
        }
    }, [userRole]);

    useEffect(() => {
        if (user) {
            fetchCarts();
        }
    }, [user])

    // truy xuất product theo cart đã lấy được
    const [products, setProducts] = useState([]);
    const fetchProducts = async (carts) => {
        try {
            const productIds = carts.map(cart => cart.id_product);
            const productsData = await productService.getproductById(productIds); 
            setProducts(productsData);
        } catch (err) {
            console.log(err.message);
        }
    };


    // console.log('là cart', carts)
    // console.log('product lấy ra từ cart', products)


    if (loading) {
        return <div className="header__top">Đang tải...</div>; 
    }

    return (
        <div className="header__top">
            <CustomToast ref={toast} />
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
                {userRole.role === "admin" ? (
                    <div className="header__top-a">
                        <Link href="/account">
                            <i className="fa-solid fa-user"></i>
                        </Link>
                        <span style={{ marginTop: '24%' }}>Admin</span>
                    </div>
                ) : userRole.role === "customer" ? (
                    <div className="header__top-a">
                        <Link href="/account">
                            <i className="fa-solid fa-user"></i>
                        </Link>
                        <span>
                            <span style={{ marginLeft: "10px" }}>{userRole.phone}</span><br />
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


            {/* Xử lý phần giỏ hàng khi hover */}
            <div className="header__top-cart">
                <a className="header__top-a" href="#">
                    <span id="count-in-cart">0</span>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span style={{ lineHeight: '33px' }}>Giỏ hàng</span>
                </a>
                <div className="detail-cart">

                <h3>Giỏ hàng</h3>
                    {/* {carts.length === 0 ? (
                        <p>Không có sản phẩm nào trong giỏ hàng.</p>
                    ) : (
                        carts.map((item, index) => (
                            <div className="cart-item" key={index}>
                                <img src={item.image || "https://via.placeholder.com/50"} alt={item.name} />
                                <div className="cart-item-info">
                                    <p>{item.name}</p>
                                    <p className="price">{item.price.toLocaleString()}đ</p>
                                </div>
                            </div>
                        ))
                    )}
                    <Link href="/cart">
                        <button className="view-cart-btn">Xem giỏ hàng</button>
                    </Link> */}






                </div>
            </div>
        </div>
    );
};

export default HeaderTop;