import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

import saleInvoiceDetailsService from "../../services/sale_invoice_detailsService";
import product_variantService from "../../services/product_variantService";
import sale_invoiceService from "../../services/sale_invoiceService";
import userAddressService from "../../services/userAddressService";
import productService from "../../services/productService";
import { useUser } from "../../components/UserContext";
import { useCart } from "../../components/CartContext";

import CustomToast from "../../components/CustomToast";
import { formatPrice } from "../../utils/formatPrice";

const Checkout = () => {
    const { user, loading } = useUser();
    const { carts, setUserId, deleteToCart } = useCart();
    const router = useRouter();
    const toast = useRef(null);

    const [newAddress, setNewAddress] = useState({ id_address: null, id_user: "", name: "", address: "", phone: "", is_default: false, created_at: "", updated_at: "" });
    const [productVariants, setProductVariants] = useState([]);
    const [cartsExceed, setCartsExceed] = useState([]); // Mảng các sản phẩm vượt quá
    const [hasExceed, setHasExceed] = useState(false); // Có vượt quá hay không
    const [userAddress, setUserAddress] = useState([]);
    const [products, setProducts] = useState([]);
    const [isDifferentAddress, setIsDifferentAddress] = useState(false);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (err) {
            console.log(err.message, "ở checkout");
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
            console.log(err.message, "ở checkout");
            setProductVariants([]);
        }
    };

    const fetchUser_Addresses = async () => {
        try {
            const user_addresses = await userAddressService.getData("id_user", user.id_user);
            setUserAddress(user_addresses);
            const defaultAddress = user_addresses.find(addr => addr.is_default);
            if (defaultAddress) {
                setNewAddress(defaultAddress);
            }
        } catch (err) {
            console.log(err.message, "ở checkout");
        }
    };

    const handleAddressChange = (e) => {
        const selectedAddress = userAddress[e.target.selectedIndex - 1];
        if (selectedAddress) {
            setNewAddress(selectedAddress);
        } else {
            setNewAddress({ id_address: "", id_user: user.id_user, name: "", address: "", phone: "", is_default: false });
        }
    };

    const checkInputAddress = () => {
        if (!newAddress.name.trim()) {
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Vui lòng nhập họ và tên", life: 3000 });
            return false;
        }
        if (!newAddress.phone.trim() || !/^\d{10}$/.test(newAddress.phone)) {
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Số điện thoại phải là 10 chữ số", life: 3000 });
            return false;
        }
        if (!newAddress.address.trim()) {
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Vui lòng nhập địa chỉ", life: 3000 });
            return false;
        }
        return true;
    };

    const checkCartsExceed = () => {
        if (!productVariants.length || !carts.length) {
            setCartsExceed([]);
            setHasExceed(false);
            return;
        }

        const exceedDetails = carts.map(cart => {
            const variant = productVariants.find(v => v.id_variant === cart.id_variant);
            if (!variant) {
                console.warn(`Không tìm thấy variant cho id_variant: ${cart.id_variant}`);
                return { ...cart, exceeds: false, available: 0 };
            }
            const exceeds = cart.quantity > variant.quantity;
            return { ...cart, exceeds, available: variant.quantity };
        });

        // Lọc các sản phẩm vượt quá
        const exceedItems = exceedDetails.filter(item => item.exceeds);
        setCartsExceed(exceedItems);
        setHasExceed(exceedItems.length > 0); // hasExceed true nếu có ít nhất 1 sản phẩm vượt quá
        console.log("Carts exceed:", exceedItems);
    };

    const handleDeleteCartExceed = async () => {
        for (const cart of cartsExceed) {
            await deleteToCart(cart);
        }
    }

    const handleCheckout = async () => {
        if (!checkInputAddress()) {
            return;
        }
        try {
            let updatedAddress = { ...newAddress };

            if (isDifferentAddress) {
                updatedAddress.id_address = null;
                const response = await userAddressService.add(updatedAddress);
                updatedAddress.id_address = response.id;
                await fetchUser_Addresses();
            }
            console.log(updatedAddress);

            const subtotal = productVariants.reduce((sum, variant) => {
                const cartItem = carts.find(item => item.id_variant === variant.id_variant);
                return sum + (variant.price * (cartItem?.quantity || 1));
            }, 0);
            const shippingFee = subtotal > 200000 ? 0 : 30000;
            const total = subtotal + shippingFee;

            const invoiceData = {
                id_user: updatedAddress.id_user,
                id_address: updatedAddress.id_address,
                desc: document.getElementById("notes").value || "",
                total: total,
                pay: document.querySelector('input[name="payment"]:checked').id === "payment-cod" ? "COD" : "QR",
                status: "Đang xác nhận",
            };
            const responseInvoice = await sale_invoiceService.addsale_invoice(invoiceData);
            const invoiceID = responseInvoice.id;

            const invoiceDetails = carts.map(cart => {
                const variant = productVariants.find(v => v.id_variant === cart.id_variant);
                return {
                    id_sale_invoice: invoiceID,
                    id_variant: cart.id_variant,
                    quantity: cart.quantity,
                    price: variant.price,
                };
            });

            for (const detail of invoiceDetails) {
                await saleInvoiceDetailsService.addDetail(detail);
            }

            toast.current.show({ severity: "success", summary: "Thành công", detail: "Đặt hàng thành công!", life: 1000 });
            await new Promise(resolve => setTimeout(resolve, 2000));

            let cartsCopy = [...carts];
            for (const cart of carts) {
                await deleteToCart(cart);
            }

            router.push({
                pathname: "/checkout/thankyou",
                query: {
                    orderPlaced: true,
                    address: JSON.stringify(updatedAddress),
                    carts: JSON.stringify(cartsCopy),
                    pay: JSON.stringify(invoiceData.pay),
                },
            });
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không thể đặt hàng, vui lòng thử lại", life: 3000 });
        }
    };

    useEffect(() => {
        if (user.id_user !== "") {
            setUserId(user.id_user);
            fetchUser_Addresses();
            fetchProduct_Variants();
            fetchProducts();
        } else {
            setUserId(null);
        }
    }, [user]);

    useEffect(() => {
        if (carts.length > 0) {
            fetchProducts();
            fetchProduct_Variants();
            fetchUser_Addresses();
        }
    }, [carts]);

    useEffect(() => {
        checkCartsExceed();
    }, [productVariants, carts]);

    if (loading) return <div className="header__top">Đang tải...</div>;
    if (user.id_user === "") {
        return (
            <div style={{ display: "flex", margin: "50px auto", justifyContent: "center" }}>
                Vui lòng <Link style={{ margin: "0 5px", color: "red" }} href={"/login"}>đăng nhập</Link> để thực hiện chức năng này!
            </div>
        );
    }

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
                    <img src="/assets/img/unnamed.jpg" alt="Rubik Ocean" className="logo" />
                    <span style={{ fontSize: "35px", margin: "0 5px 0 5px", fontWeight: "bold" }}>
                        Rubik Ocean
                    </span>
                </header>

                {hasExceed ? (
                    <div className="checkout-wrapper-ex">
                        <div style={{ display: "flex", justifyContent: "center", flex: "2" }} className="thankyou">
                            <div style={{ flex: "0.7" }}>
                                <div style={{ display: "flex" }}>
                                    <div className="logo_thankyou">
                                        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" stroke="#ccc" strokeWidth="2" className="section__hanging-icon">
                                            <path d="M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z" fill="none"></path>
                                            <path d="M25 12v18"></path>
                                            <circle fill="#ccc" cx="25" cy="37" r="2" stroke="none"></circle>
                                        </svg>
                                    </div>
                                    <div className="info_thankyou">
                                        <div className="thankyou_message">
                                            <span style={{ color: "#333", fontWeight: "600", fontSize: "16px" }}>Thông báo</span>
                                            <span style={{ lineHeight: "20px", marginTop: "10px"}}>
                                                Một số sản phẩm trong giỏ hàng không còn đủ số lượng để đặt hàng. <br />Chúng tôi vô cùng xin lỗi vì bất tiện này!
                                            </span>
                                        </div>
                                        <span style={{ color: "red", marginTop: "20px" }}>Bạn muốn loại bỏ các sản phẩm này ra khỏi giỏ hàng?</span>
                                        <div className="checkout-actions" style={{ width: "" }}>
                                            <Link href="/account/carts" className="back-link">
                                                <svg viewBox="0 0 512.076 512.076" style={{ width: "15px" }}>
                                                    <path style={{ fill: "rgb(55, 130, 23)" }} d="M178.5,140.25v-102L0,216.75l178.5,178.5V290.7c127.5,0,216.75,40.8,280.5,130.05C433.5,293.25,357,165.75,178.5,140.25z"></path>
                                                </svg>
                                                Quay về giỏ hàng
                                            </Link>
                                            <button className="checkout-button" onClick={handleDeleteCartExceed}>Tiếp tục</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="order-summary" style={{ flex: "0.7" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h4>Sản phẩm</h4>
                                    <h4 style={{ marginTop: "0px" }}>Số lượng</h4>
                                </div>

                                {cartsExceed.map((cart, index) => {
                                    const variant = productVariants.find((v) => v.id_variant === cart.id_variant) || {};
                                    const product = products.find((p) => p.id_product === variant.id_product) || {};

                                    return (
                                        <div className="product-item" key={index}>
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                            <div className="product-details">
                                                <span className="quantity-badge">{cart.quantity}</span>
                                                <span className="product-name">{product.name}</span>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span>{variant.color !== "không có" ? "Màu sắc: " + variant.color : null}</span>
                                                    <span className="product-price cart-product__price">
                                                        Còn: {cart.available} | {formatPrice(variant.price)}đ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </aside>
                        </div>
                    </div>
                ) : (
                    <main className="checkout-wrapper">
                        <section className="checkout-form">
                            <div className="form-section customer-info">
                                <div className="section-header">
                                    <h3>Thông tin mua hàng</h3>
                                </div>

                                <form className="customer-form">
                                    <div className="form-group">
                                        <label htmlFor="address-select">Chọn địa chỉ</label>
                                        <div className="custom-select">
                                            <select
                                                id="address-select"
                                                onChange={handleAddressChange}
                                                disabled={isDifferentAddress}
                                                value={newAddress.id_address || ""}
                                            >
                                                <option value="">{isDifferentAddress ? "Địa chỉ mới" : "Địa chỉ khác..."}</option>
                                                {userAddress.map((addr) => (
                                                    <option key={addr.id_address} value={addr.id_address}>
                                                        {addr.name} - {addr.phone} - {addr.address}
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="fa fa-caret-down"></i>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={user.email || ""}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="full-name">Họ và tên</label>
                                        <input
                                            type="text"
                                            id="full-name"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            required
                                            disabled={!isDifferentAddress && newAddress.id_address}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Số điện thoại</label>
                                        <div className="phone-input">
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                required
                                                disabled={!isDifferentAddress && newAddress.id_address}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Địa chỉ</label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={newAddress.address}
                                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                            required
                                            disabled={!isDifferentAddress && newAddress.id_address}
                                        />
                                    </div>

                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="different-address"
                                            checked={isDifferentAddress}
                                            onChange={(e) => {
                                                setIsDifferentAddress(e.target.checked);
                                                if (e.target.checked) {
                                                    setNewAddress({ id_address: "", id_user: user.id_user, name: "", address: "", phone: "", is_default: false });
                                                } else {
                                                    const defaultAddress = userAddress.find(addr => addr.is_default);
                                                    setNewAddress(defaultAddress || { id_address: "", id_user: user.id_user, name: "", address: "", phone: "", is_default: false });
                                                }
                                            }}
                                        />
                                        <label htmlFor="different-address">Giao hàng đến địa chỉ khác</label>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="notes" className="visually-hidden">
                                            Ghi chú
                                        </label>
                                        <textarea
                                            id="notes"
                                            placeholder="Ghi chú (tùy chọn)"
                                        ></textarea>
                                    </div>
                                </form>
                            </div>

                            <div className="form-section shipping-payment">
                                <div className="payment-section">
                                    <h3>Phương thức thanh toán</h3>
                                    <div className="radio-option radio-option-pay-cod">
                                        <input
                                            type="radio"
                                            id="payment-cod"
                                            name="payment"
                                            defaultChecked
                                        />
                                        <label htmlFor="payment-cod">
                                            Thanh toán khi giao hàng (COD)
                                        </label>
                                    </div>

                                    <div className="radio-option radio-option-pay-qr">
                                        <input
                                            type="radio"
                                            id="payment-qr"
                                            name="payment"
                                        />
                                        <label htmlFor="payment-qr">
                                            Chuyển khoản (QR)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <aside className="order-summary">
                            <h3>Đơn hàng ({carts.length} sản phẩm)</h3>

                            {carts.map((cart, index) => {
                                const variant = productVariants.find((v) => v.id_variant === cart.id_variant) || {};
                                const product = products.find((p) => p.id_product === variant.id_product) || {};

                                return (
                                    <div className="product-item" key={index}>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                        <div className="product-details">
                                            <span className="quantity-badge">{cart.quantity}</span>
                                            <span className="product-name">{product.name}</span>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span>{variant.color !== "không có" ? "Màu sắc: " + variant.color : null}</span>
                                                <span className="product-price cart-product__price">{formatPrice(variant.price) + "đ"}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="discount-code">
                                <input
                                    type="text"
                                    placeholder="Nhập mã giảm giá"
                                    aria-label="Mã giảm giá"
                                />
                                <button type="button" className="apdung">Áp dụng</button>
                            </div>

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

                            <div className="checkout-actions">
                                <Link href="/account/carts" className="back-link">
                                    <svg viewBox="0 0 512.076 512.076" style={{ width: "15px" }}>
                                        <path style={{ fill: "rgb(55, 130, 23)" }} d="M178.5,140.25v-102L0,216.75l178.5,178.5V290.7c127.5,0,216.75,40.8,280.5,130.05C433.5,293.25,357,165.75,178.5,140.25z"></path>
                                    </svg>
                                    Quay về giỏ hàng
                                </Link>
                                <button className="checkout-button" onClick={handleCheckout}>ĐẶT HÀNG</button>
                            </div>
                        </aside>
                    </main>
                )}
            </div>
        </div>
    );
};

Checkout.getLayoutCheckout = function getLayoutCheckout(page) {
    return page;
};

export default Checkout;