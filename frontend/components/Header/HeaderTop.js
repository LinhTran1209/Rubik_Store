import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link'; 

import product_variantsService from '../../services/product_variantService'
import productService from '../../services/productService';
import authService from '../../services/authService';

import SearchProduct from '../../components/SearchProduct';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from "../CartContext";
import { useUser } from "../UserContext";
import CustomToast from '../CustomToast';

const HeaderTop = () => {
    const { user, loading, logout } = useUser();
    const { carts, setUserId } = useCart();
    const toast = useRef(null);

    const [ productVariants, setProductVariants ] = useState([{ id_variant: "", id_product: "", color: "", price: "", quantity: "" }]);
    const [ products, setProducts ] = useState([]);

    const fetchProducts = async () => {
        try {
            const productsData = await productService.getAllproducts(); 
            setProducts(productsData);
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchProduct_Variants = async () => {
        try {
            const id_variants = carts.map((c) => c.id_variant).filter(Boolean);
            if (id_variants.length > 0) {
                const variantPromises = id_variants.map((id) => product_variantsService.getByIdVariant(id));
                const variants = await Promise.all(variantPromises);
                setProductVariants(variants.filter(Boolean)); // Lọc bỏ các giá trị undefined/null
            }
        } catch (err) {
            console.log(err.message, "ở order khách hàng");
            setProductVariants([]);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.current.show({ severity: "success", summary: "Thành công", detail: "Đăng xuất thành công", life: 3000});
            window.location.href = "/home";
        } catch (error) {
            alert("Đăng xuất thất bại, vui lòng thử lại.");
        }
    };

    useEffect(() => {
        if (user.id_user !== "") {
            setUserId(user.id_user);
        } else {
            setUserId(null);
        }
    }, [user]);

    useEffect(() => {
        if (carts.length > 0) {
            fetchProduct_Variants();
            fetchProducts();
        }
    }, [carts]);

    if (loading) return <div className="header__top">Đang tải...</div>; 

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
                {user.role === "admin" ? (
                    <div className="header__top-a">
                        <Link href="/account">
                            <i className="fa-solid fa-user"></i>
                        </Link>
                        <span style={{ marginTop: '24%' }}>Admin</span>
                    </div>
                ) : user.role === "customer" ? (
                    <div className="header__top-a">
                        <Link href="/account">
                            <i className="fa-solid fa-user"></i>
                        </Link>
                        <span>
                            <span style={{ marginLeft: "10px" }}>{user.name}</span><br />
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


            {/* Giỏ hàng khi hover */}
            <div className="header__top-cart">
                <Link className="header__top-a" href="/account/carts">
                    <span className="count-in-cart">{carts.length}</span>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span style={{ lineHeight: '33px' }}>Giỏ hàng</span>
                </Link>
                <div className="detail-cart">
                    { carts.length > 0 ? 
                        (
                            <>
                                <div className="product__news">Sản phẩm mới thêm</div>

                                {carts.map((cart, index) => {
                                    const variant = productVariants.find((v) => v.id_variant === cart.id_variant) || {};
                                    const product = products.find((p) => p.id_product === variant.id_product) || {};
                                    return (      
                                        <div className='cart-products' key={index}>
                                            <Link href={`/detail_product/${product.slug}`}>
                                                <div className="cart-product">
                                                    <img style={{position: ""}} src={product.image_url} alt={product.name}/>
                                                    <span className="count-prouduct-in-cart">{cart.quantity}</span>
                                                    <div className="cart-product__info">
                                                        <p className="cart-product__name">{product.name}</p>
                                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                            <p style={{margin: "auto 0"}}>{variant.color !== "không có" ? "Màu sắc: " + variant.color : null}</p>
                                                            <p className="cart-product__price">{formatPrice(variant.price)}đ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );

                                })}

                                <div className="class__cart-check">
                                    <Link id="a__cart-check" href="/account/carts">Xem giỏ hàng</Link>
                                </div>
                                <div style={{marginBottom: "20px"}}></div>
                            </>
                        ) :
                        (
                            user.phone !== "" ?
                            (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#8a6d3b", backgroundColor: "#fcf8e3", height: "50px" }}>Giỏ hàng của bạn đang trống!</div>
                            ):
                            (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#8a6d3b", backgroundColor: "#fcf8e3", height: "50px" }}>Vui lòng đăng nhập để xem giỏ hàng của bạn!</div>
                            )
                            
                        )
                
                    }
                </div>
            </div>
        </div>
    );
};

export default HeaderTop;