import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import product_variantsService from "../../../services/product_variantService";
import productService from "../../../services/productService";

import CustomToast from "../../../components/CustomToast";
import { useUser } from "../../../components/UserContext";
import { formatPrice } from "../../../utils/formatPrice";
import { useCart } from "../../../components/CartContext";

const Carts = () => {
    const { carts, updateToCart, deleteToCart } = useCart();
    const { user, loading } = useUser();
    const router = useRouter();
    const toast = useRef(null);

    const [productVariants, setProductVariants] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (err) {
            console.log(err.message, "ở carts khách hàng");
            setProducts([]);
        }
    };

    const fetchProduct_Variants = async () => {
        try {
            const id_variants = carts
                .map((cart) => cart.id_variant)
                .filter(Boolean);
            if (id_variants.length > 0) {
                const variantPromises = id_variants.map((id) =>
                    product_variantsService.getByIdVariant(id)
                );
                const variants = await Promise.all(variantPromises);
                setProductVariants(variants.filter(Boolean));
            }
        } catch (err) {
            console.log(err.message, "ở carts khách hàng");
            setProductVariants([]);
        }
    };

    const handleRowClick = (slug_product) => {
        router.push(`/detail_product/${slug_product}`);
    };

    const handleDecreaseQuantity = (cart) => async () => {
        const updatedCartItem = {
            id_user: user.id_user,
            id_variant: cart.id_variant,
            quantity: cart.quantity - 1,
            price: cart.price,
        };

        try {
            await updateToCart(updatedCartItem);
        } catch (error) {
            console.log( error.message, "Lỗi khi giảm số lượng sản phẩm trong giỏ hàng");
        }
    };

    const handleIncreaseQuantity = (cart) => async () => {
        const variant = productVariants.find((v) => v.id_variant === cart.id_variant);

        if (cart.quantity + 1 > variant.quantity) {
            if (toast.current) {
                toast.current.show({severity: "warn", summary: "Cảnh báo", detail: "Số lượng trong kho không đủ!", life: 3000 });
            }
            return;
        }

        const updatedCartItem = {
            id_user: user.id_user,
            id_variant: cart.id_variant,
            quantity: cart.quantity + 1,
            price: cart.price,
        };

        try {
            await updateToCart(updatedCartItem);
        } catch (error) {
            console.log(error.message, "Lỗi khi tăng số lượng sản phẩm trong giỏ hàng" );
        }
    };

    const handleDeleteItem = (cart) => async () => {
        const cartItem = { id_user: user.id_user, id_variant: cart.id_variant, };

        try {
            await deleteToCart(cartItem);
            if (toast.current) {
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Sản phẩm đã được xóa khỏi giỏ hàng!", life: 900});
            }
        } catch (error) {
            console.log(error.message, "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
        }
    };

    const checkOrder = () => {
        const outOfStockItems = carts.filter(cart => {
            const variant = productVariants.find((v) => v.id_variant === cart.id_variant) || {};
            const product = products.find((p) => p.id_product === variant.id_product ) || {};
            return product.status === "ẩn";
        });
        if (outOfStockItems.length === 0) 
            router.push("/checkout");
        else
            toast.current.show({ severity: "info", summary: "Thông báo", detail: "Hãy loại bỏ những sản phẩm hết hàng để tiếp tục!", life: 1200});
    }

    useEffect(() => {
        if (carts.length > 0) {
            fetchProduct_Variants();
            fetchProducts();
        }
    }, [carts]);

    if (loading) return <div className="header__top">Đang tải...</div>;

    return (
        <div className="middle__carts">
            <CustomToast ref={toast} />
            <div className="all__section-header" style={{ marginLeft: "30px" }}>
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span className="all__section-header-text">
                    <Link href="/account">Tài khoản</Link>
                </span>
                <span>
                    <Link href="/account/carts">Giỏ hàng</Link>
                </span>
            </div>

            <div className="middle__carts_main">
                {user.id_user !== "" ? (
                    <div className="middle__order_main">

                        <div className="middle__address_title">
                            <h2 style={{ display: "flex", margin: "auto 0" }}>GIỎ HÀNG CỦA BẠN</h2>
                            <Link href="/account" style={{ fontWeight: "500", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px"}}>
                                <svg viewBox="0 0 512.076 512.076" style={{ width: "15px" }}>
                                    <path style={{ fill: "rgb(55, 130, 23)" }} d="M178.5,140.25v-102L0,216.75l178.5,178.5V290.7c127.5,0,216.75,40.8,280.5,130.05C433.5,293.25,357,165.75,178.5,140.25z"></path>
                                </svg>
                                Quay lại trang tài khoản
                            </Link>
                        </div>

                        <div className="content_order">
                            <table className="order_details">
                                <thead>
                                    <tr>
                                        <th>Ảnh sản phẩm</th>
                                        <th>Sản phẩm</th>
                                        <th>Màu sắc</th>
                                        <th className="modify_quantity_cart">
                                            Số lượng
                                        </th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                        <th>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {carts.map((cart, index) => {
                                    const variant = productVariants.find((v) => v.id_variant === cart.id_variant) || {};
                                    const product = products.find((p) => p.id_product === variant.id_product ) || {};
                                    const total = cart.quantity * cart.price;

                                    const isOutOfStock = product.status === "ẩn";

                                    return (
                                        <tr
                                            className="td_account_order"
                                            key={index}
                                        >
                                            <td onClick={() => handleRowClick(product.slug)} style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                                                <div style={{ position: "relative" }}>
                                                    <img style={{ width: "70px" }} src={product.image_url} alt={product.name} />
                                                    {isOutOfStock && (
                                                        <span
                                                            style={{
                                                                position: "absolute",
                                                                bottom: "3px",
                                                                color: "red",
                                                                left: "0px",
                                                                backgroundColor: "#d5d5d5",
                                                                padding: "3px 9px",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            Hết hàng
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td onClick={() => handleRowClick(product.slug)} style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                                                {product.name || "N/A"}
                                            </td>
                                            <td onClick={() => handleRowClick(product.slug)} style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                                                {variant.color || "N/A"}
                                            </td>
                                            <td style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                                                <div className="input_quantity_cart">
                                                    <button
                                                        className="btn-quantity_cart btn-quantity-cart-reduce"
                                                        onClick={isOutOfStock ? null : handleDecreaseQuantity(cart)} // Vô hiệu hóa nếu hết hàng
                                                        disabled={isOutOfStock}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        style={{ backgroundColor: "white" }}
                                                        className="quantity_cart"
                                                        type="text"
                                                        value={cart.quantity}
                                                        readOnly
                                                    />
                                                    <button
                                                        className="btn-quantity_cart btn-quantity-cart-increase"
                                                        onClick={isOutOfStock ? null : handleIncreaseQuantity(cart)} // Vô hiệu hóa nếu hết hàng
                                                        disabled={isOutOfStock}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td onClick={() => handleRowClick(product.slug)} style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                                                {formatPrice(cart.price)}đ
                                            </td>
                                            <td onClick={() => handleRowClick(product.slug)} style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                                                {formatPrice(total)}đ
                                            </td>
                                            <td>
                                                <button
                                                    className="remove-item-cart always-visible"
                                                    title="Xóa"
                                                    onClick={handleDeleteItem(cart)}
                                                >
                                                    x
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                </tbody>
                            </table>

                            {(carts.length > 0 && (
                                <div className="order_summary" style={{ margin: "50px auto", display: "flex",}}>
                                    <div className="order_summary_title" style={{ flex: 1 }}></div>
                                    <div className="totals">
                                        <div className="inner">
                                            <table>
                                                <colgroup>
                                                    <col />
                                                    <col />
                                                </colgroup>

                                                <tfoot>
                                                    <tr style={{borderBottom:"1px solid #ebebeb"}}>
                                                        <td colSpan={1}>
                                                            <h3 style={{ color: "rgb(55, 130, 23)",fontWeight: "bold",}}>Thanh toán</h3>
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={1}>
                                                            <strong>
                                                                Phí vận chuyển
                                                            </strong>
                                                        </td>
                                                        <td style={{float: "right",}}>
                                                            {carts.reduce((total, cart) => total + cart.price * cart.quantity, 0) >= 200000 ? "Miễn phí" : "30.000đ"}
                                                        </td>
                                                    </tr>
                                                    <tr style={{borderBottom: "1px solid #ebebeb",}}>
                                                        <td colSpan={1}>
                                                            <strong>
                                                                Tổng tiền:
                                                            </strong>
                                                        </td>
                                                        <td style={{ float: "right",color: "red",}}>
                                                            <strong>
                                                                {carts.reduce((total, cart) => total + cart.price * cart.quantity, 0) >= 200000 
                                                                    ? formatPrice(carts.reduce((total, cart) => total + cart.price * cart.quantity, 0)) + "đ"
                                                                    : formatPrice(carts.reduce((total, cart) => total + cart.price * cart.quantity, 0) + 30000) + "đ"}
                                                            </strong>

                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            <ul className="checkout">
                                                <li>
                                                    <button className="btn-checkout btn-checkout-order" onClick={checkOrder}>
                                                        TIẾN HÀNH ĐẶT HÀNG
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="btn-checkout btn-checkout-continue" onClick={() => router.push("/home")}>
                                                        TIẾP TỤC MUA HÀNG
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{display: "flex",margin: "auto",color: "#8a6d3b",justifyContent: "center",}}>
                        Bạn cần{" "}
                        <Link href="/login" style={{ color: "red", margin: "0 4px" }}>đăng nhập</Link>{" "}
                        để xem giỏ hàng. Vui lòng quay lại sau!
                    </div>
                )}
            </div>
        </div>
    );
};

Carts.getLayoutWeb = function getLayoutWeb(page) {
    return page;
};

export default Carts;
