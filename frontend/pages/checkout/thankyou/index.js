import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

import productService from "../../../services/productService";
import product_variantService from "../../../services/product_variantService";
import { useUser } from "../../../components/UserContext";

import CustomToast from "../../../components/CustomToast";
import { formatPrice } from "../../../utils/formatPrice";

const Thankyou = () => {
    const { user, loading } = useUser();
    const router = useRouter();
    const toast = useRef(null);

    const [newAddress, setNewAddress] = useState({ id_address: "", id_user: "", name: "", address: "", phone: "", is_default: false, created_at: "", updated_at: "" });
    const [carts, setCarts] = useState([]);
    const [pay, setPay] = useState(null)
    const [productVariants, setProductVariants] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (err) {
            console.log(err.message, "ở thankyou");
            setProducts([]);
        }
    };

    const fetchProduct_Variants = async () => {
        try {
            const id_variants = carts.map((cart) => cart.id_variant).filter(Boolean);
            if (id_variants.length > 0) {
                const variantPromises = id_variants.map((id) => product_variantService.getByIdVariant(id));
                const variants = await Promise.all(variantPromises);
                setProductVariants(variants.filter(Boolean));
            }
        } catch (err) {
            console.log(err.message, "ở thankyou");
            setProductVariants([]);
        }
    };

    useEffect(() => {
        if (!router.isReady) return; // Đợi router sẵn sàng
        const { orderPlaced, address, carts, pay } = router.query;
        if (!orderPlaced || orderPlaced !== "true") {
            router.push("/home"); // Chuyển về trang chủ nếu không đặt hàng
        } else {
            try {
                setNewAddress(JSON.parse(address || "{}"));
                setCarts(JSON.parse(carts));
                setPay(JSON.parse(pay))
            } catch (error) {
                console.error("Lỗi parse query:", error);
                toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải thông tin đơn hàng", life: 3000 });
                router.push("/home");
            }
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (carts.length > 0) {
            fetchProducts();
            fetchProduct_Variants();
        }
    }, [carts]);

    if (loading) return <div className="header__top">Đang tải...</div>;
    if (!user) return <div>Vui lòng đăng nhập để tiếp tục</div>;

    const subtotal = productVariants.reduce((sum, variant) => {
        const cartItem = carts.find(item => item.id_variant === variant.id_variant);
        return sum + (variant.price * (cartItem?.quantity || 1));
    }, 0);
    const shippingFee = subtotal > 200000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    return (
        <div className="checkout">
            <CustomToast ref={toast} />
            <div className="checkout-container">
                <header className="checkout-header">
                    <img src="/assets/img/unnamed.ico" alt="Rubik Ocean" className="logo" />
                    <span style={{ fontSize: "35px", margin: "0 5px", fontWeight: "bold" }}>
                        Rubik Ocean
                    </span>
                </header>

                <main className="checkout-wrapper">
                    <section className="checkout-thankyou">
                        <div className="thankyou">
                            <div className="logo_thankyou">
                                <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                                    <g fill="none" stroke="#8EC343" strokeWidth="2">
                                        <circle cx="36" cy="36" r="35" style={{ strokeDasharray: "240px, 240px", strokeDashoffset: "480px" }} />
                                        <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style={{ strokeDasharray: "50px, 50px", strokeDashoffset: "0px" }} />
                                    </g>
                                </svg>
                            </div>
                            <div className="info_thankyou">
                                <div className="thankyou_message">
                                    <span style={{ color: "#333", fontWeight: "600", fontSize: "16px" }}>Đặt hàng thành công</span>
                                    <span style={{ lineHeight: "20px" }}>
                                        Một email xác nhận đã được gửi tới {user.email}. <br />Vui lòng kiểm tra email của bạn!
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "block", border: "1px solid #dadada", marginTop: "30px", marginRight: "10px" }}>
                            <div className="checkout-form_main">
                                <div className="form-section customer-info">
                                    <div style={{ marginBottom: "10px" }} className="section-header">
                                        <h3 style={{ fontWeight: "normal" }}>Thông tin mua hàng</h3>
                                    </div>
                                    <form className="customer-form">
                                        <div className="form-group flex-form-group">
                                            <img src="//bizweb.dktcdn.net/100/316/286/themes/757383/assets/user.svg?1738317141988" alt="" style={{ width: "16px" }} />
                                            <label className="margin-label">{newAddress.name || "Không có thông tin"}</label>
                                        </div>
                                        <div className="form-group flex-form-group">
                                            <img src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/telephone.svg?1738317141988" alt="" style={{ width: "16px" }} />
                                            <label className="margin-label">{newAddress.phone || "Không có thông tin"}</label>
                                        </div>
                                        <div className="form-group flex-form-group">
                                            <img src="https://res.cloudinary.com/dzweargsr/image/upload/v1743411123/icon_email_ddhq4g.ico" alt="" style={{ width: "20px" }} />
                                            <label className="margin-label">{user.email || "Không có thông tin"}</label>
                                        </div>
                                        <div className="form-group flex-form-group">
                                            <img src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/map-marker.svg?1738317141988" alt="" style={{ width: "16px" }} />
                                            <label className="margin-label">{newAddress.address || "Không có thông tin"}</label>
                                        </div>
                                    </form>
                                </div>

                                <div className="form-section shipping-payment">
                                    <div style={{ marginBottom: "10px" }} className="section-header">
                                        <h3 style={{ fontWeight: "normal" }}>Phương thức thanh toán</h3>
                                    </div>
                                    <form className="customer-form">
                                        <div className="form-group flex-form-group">
                                            <img src="https://res.cloudinary.com/dzweargsr/image/upload/v1743567639/pay_vyjlry.png" alt="" style={{ width: "30px" }} />
                                            <label>{pay === "COD" ? "Thanh toán khi nhận hàng (1 - 3 ngày)" : "Chuyển khoản (QR)"}</label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: "40px", display: "flex", justifyContent: "end", marginRight: "10px" }}>
                            <button className="continue__buying" onClick={() => router.push("/home")}>Tiếp tục mua hàng</button>
                        </div>
                    </section>

                    <aside className="order-summary">
                        <h3>Đơn hàng ({carts.length} sản phẩm)</h3>
                        {carts.length === 0 ? (
                            <p>Không có sản phẩm nào trong đơn hàng.</p>
                        ) : (
                            carts.map((cart, index) => {
                                const variant = productVariants.find((v) => v.id_variant === cart.id_variant) || {};
                                const product = products.find((p) => p.id_product === variant.id_product) || {};
                                return (
                                    <div className="product-item" key={index}>
                                        <img src={product.image_url || "/placeholder.jpg"} alt={product.name || "Sản phẩm"} className="product-image" />
                                        <div className="product-details">
                                            <span className="quantity-badge">{cart.quantity}</span>
                                            <span className="product-name">{product.name || "Không có tên"}</span>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span>{variant.color !== "không có" ? "Màu sắc: " + variant.color : null}</span>
                                                <span className="product-price cart-product__price">{formatPrice(variant.price || 0) + "đ"}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div className="order-totals">
                            <div className="subtotal">
                                <span>Tạm tính</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="shipping-fee">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                            </div>
                            <div className="total">
                                <span>Tổng cộng</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};

Thankyou.getLayoutCheckout = function getLayoutCheckout(page) {
    return page;
};

export default Thankyou;