import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import product_variantsService from "../../services/product_variantService";
import product_imagesService from "../../services/product_imageService";
import categorieService from "../../services/categorieService";
import productService from "../../services/productService";
import { useCart } from "../../components/CartContext";
import { useUser } from "../../components/UserContext";

import CustomToast from "../../components/CustomToast";
import { formatPrice } from "../../utils/formatPrice";


const ProductDetail = () => {
    const router = useRouter();
    const toast = useRef(null);
    const { slug } = router.query;
    const { user, loading } = useUser();
    const { carts, addToCart, updateToCart } = useCart();

    const [product, setProduct] = useState(null); 
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]); 
    const [categorie, setCategorie] = useState([]);

    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [mainImage, setMainImage] = useState(null);
    const [productImages, setProductImages] = useState([]); 
    const [selectedVariant, setSelectedVariant] = useState(null); 

    const fetchProduct = async () => {
        try {
            const data = await productService.getDataproducts("slug", slug);
            if (data.length > 0) {
                setProduct(data[0]);
                fetchVariants(data[0].id_product);
            } else {
                setProduct(null);
            }
        } catch (err) {
            console.log(err.message, "ở detail produt")
        }
    };

    const fetchVariants = async (id_product) => {
        try {
            const data = await product_variantsService.getData("id_product", id_product);
            setVariants(data);
            if (data.length > 0) {
                setSelectedVariant(data[0]); 
                setTotalPrice(data[0].price * quantity); 
            }
        } catch (err) {
            console.log(err.message, "ở detail produt");
        }
    };

    const fetchProductImages = async () => {
        if (product?.id_product) {
            try {
                const data = await product_imagesService.getByIdProduct(
                    product.id_product
                );
                setProductImages(data);
                const mainImg = data.find((img) => img.is_main) || data[0];
                if (mainImg) {
                    setMainImage(mainImg.image_url);
                }
            } catch (err) {
                console.log(err.message, "ở detail product");
            }
        }
    };

    const fetchProductSuggested = async () => {
        if (product && product.id_categorie) {
            try {
                const productsData = await productService.getDataproducts(
                    "id_categorie",
                    product.id_categorie
                );
                const productsWithVariants = await Promise.all(
                    productsData.map(async (prod) => {
                        const variants = await product_variantsService.getData(
                            "id_product",
                            prod.id_product
                        );
                        if (variants.length > 0) {
                            const minPrice = Math.min(
                                ...variants.map((v) => v.price)
                            );
                            return { ...prod, price: minPrice, variants };
                        }
                        return null;
                    })
                );
                const filteredProducts = productsWithVariants.filter(
                    (p) => p !== null
                );
                const dataRandom = [...filteredProducts].sort(
                    () => Math.random() - 0.5
                );
                setProducts(dataRandom);
            } catch (err) {
                console.log(err.message, "ở detail product suggested");
            }
        }
    };

    const fetchCategorie = async () => {
        try {
            if (product) {
                const data = await categorieService.getcategorieById(
                    product.id_categorie
                );
                setCategorie(data[0]);
            }
        } catch (err) {
            console.log(err.message, "ở detail product [slug]");
        }
    };

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (user.id_user === "") {
            // Nếu chưa đăng nhập
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Vui lòng đăng nhập để mua hàng!",life: 3000});
            return;
        }

        try {

            if (quantity > selectedVariant.quantity) {
                toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Số lượng bạn yêu cầu không đủ. Vui lòng thay đổi số lượng!"})
                return;
            }
            // Tạo cart để thêm
            const cartItem = { id_user: user.id_user,  id_variant: selectedVariant.id_variant, quantity: quantity, price: totalPrice };

            //Kiểm tra trong cart đã có chưa, có ? updateToCart làm tăng số lượng : thêm mới
            if (carts.find((c) => c.id_variant === cartItem.id_variant)) {
                cartItem.quantity = cartItem.quantity + carts.find((c) => c.id_variant === cartItem.id_variant).quantity
                await updateToCart(cartItem);
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Sản phẩm đã được thêm vào giỏ hàng!", life: 3000});
            } else {
                await addToCart(cartItem);
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Sản phẩm đã được thêm vào giỏ hàng!", life: 3000});
            }
        } catch (error) {
            if (toast.current) {
                toast.current.show({ severity: "error", summary: "Lỗi", detail: "Thêm vào giỏ hàng thất bại, vui lòng thử lại!", life: 3000});
            }
            console.log(error.message, "ở handleAddToCart");
        }
    };

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    useEffect(() => {
        fetchProductSuggested();
        fetchProductImages();
        fetchCategorie();
    }, [product]);

    useEffect(() => {
        if (product && typeof product.price === "number") {
            setTotalPrice(product.price * quantity);
        }
    }, [product, quantity]);

    useEffect(() => {
        if (selectedVariant && typeof selectedVariant.price === "number") {
            setTotalPrice(selectedVariant.price * quantity);
        }
    }, [selectedVariant, quantity]);

    if (loading) return <div className="header__top">Đang tải...</div>; 
    if (!product) return <div style={{display: "flex", justifyContent: "center", marginTop: "100px", color: "#8a6d3b"}}>Sản phẩm không tồn tại. Vui lòng kiểm tra lại lựa chọn của bạn hoặc thử một đường dẫn khác!</div>;

    return (
        <div className="product-detail">
            <CustomToast ref={toast} />
            <div className="all__section-header">
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span className="all__section-header-text">
                    <Link href={`/category/${categorie.slug}`}>{categorie.name}</Link>
                </span>
                <span className="all__section-header-text">
                    <Link href={`/detail_product/${product.slug}`}>
                        {product.name}
                    </Link>
                </span>
            </div>

            {/* Nội dung chính */}
            <div className="product-detail__container">
                <div className="product-detail__main">
                    {/* ảnh sản phẩm */}
                    <div className="product-detail__images">
                        <div className="product-detail__main-image">
                            <img src={mainImage || product.image_url} alt={product.name}/>
                        </div>
                        <div
                            className="product-detail__thumbnails">
                            {productImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.image_url}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => setMainImage(img.image_url)}
                                    style={{
                                        cursor: "pointer",
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        border:
                                            mainImage === img.image_url
                                                ? "2px solid #e74c3c"
                                                : "none",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* sản phẩm */}
                    <div className="product-detail__info">
                        <h1 className="product-detail__title">
                            {product.name}
                        </h1>
                        <p className="product-detail__meta">
                            Mã SP: {product.id_product} | Thương hiệu: GAN
                        </p>
                        <div className="product-detail__rating">
                            <span className="stars">★★★★★</span>
                            <span className="rating-count"> (1 đánh giá)</span>
                        </div>
                        <div className="product-detail__price">
                            <span className="current-price">
                                {selectedVariant
                                    ? formatPrice(selectedVariant.price)
                                    : formatPrice(
                                          Math.min(
                                              ...variants.map((v) => v.price)
                                          )
                                      )}đ
                            </span>
                            <span className="original-price">
                                {formatPrice(
                                    1.2 *
                                        Math.max(
                                            ...variants.map((v) => v.price)
                                        )
                                )}đ
                            </span>
                        </div>
                        <div className="product-detail__promotion">
                            <p className="promotion-title">
                                <strong>ƯU ĐÃI KHUYẾN MÃI</strong>
                            </p>
                            <p className="promotion-item">
                                ✔ Freeship đơn hàng từ 200.000đ
                            </p>
                        </div>

                        {variants.length > 0 &&
                            !variants.every(
                                (variant) => variant.color === "không có"
                            ) && (
                                <div
                                    className="product-detail__color"
                                    style={{ display: "flex" }}
                                >
                                    <p style={{ marginTop: "5px" }}>
                                        <strong style={{ marginRight: "10px" }}>
                                            Màu sắc:
                                        </strong>
                                    </p>
                                    <div
                                        style={{ display: "flex", gap: "10px" }}
                                    >
                                        {variants.map(
                                            (variant) =>
                                                variant.color !==
                                                    "không có" && (
                                                    <button
                                                        key={variant.id_variant}
                                                        onClick={() =>
                                                            setSelectedVariant(
                                                                variant
                                                            )
                                                        }
                                                        style={{
                                                            padding: "5px 10px",
                                                            border:
                                                                selectedVariant?.color ===
                                                                variant.color
                                                                    ? "2px solid #e74c3c"
                                                                    : "1px solid #ccc",
                                                            backgroundColor:
                                                                selectedVariant?.color ===
                                                                variant.color
                                                                    ? "#ffe6e6"
                                                                    : "#fff",
                                                            cursor: "pointer",
                                                            borderRadius: "4px",
                                                            fontSize: "14px",
                                                            textTransform:
                                                                "capitalize",
                                                        }}
                                                    >
                                                        {variant.color}
                                                    </button>
                                                )
                                        )}
                                    </div>
                                </div>
                            )}

                        <div className="product-detail__quantity">
                            <label htmlFor="quantity">
                                <strong>Số lượng:</strong>
                            </label>
                            <input
                                style={{
                                    width: "50px",
                                    marginLeft: "10px",
                                    textAlign: "center",
                                }}
                                type="number"
                                id="quantity"
                                value={quantity}
                                min="1"
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                            />
                        </div>
                        <div className="product-detail__total">
                            <p>
                                <strong className="total-label">
                                    Thanh toán:
                                </strong>
                                <span
                                    className="total-price"
                                    style={{
                                        color: "#e74c3c",
                                        marginLeft: "10px",
                                    }}
                                >
                                    {formatPrice(totalPrice)}đ
                                </span>
                            </p>
                        </div>
                        <div className="product-detail__actions">
                            <button className="btn btn--buy-now">
                                MUA NGAY <br />
                            </button>
                            <button className="btn btn--add-to-cart" onClick={handleAddToCart}>
                                THÊM VÀO GIỎ HÀNG
                            </button>
                        </div>
                        <p className="product-detail__contact">
                            Hoặc gọi ngay để đặt mua: 0344665810 (8:00-20:00)
                        </p>
                    </div>

                    <div className="product-desc"
                        style={{
                            display: "block",
                            width: "800px",
                            clear: "both",
                        }}
                    >

                        <div className="article_content">
                            <p>
                                <strong>{product.name}</strong>
                            </p>
                            <p>
                                GAN 356 M 3X3 là khối rubik cao cấp mới nhất
                                trong phân khúc 3x3 được hãng GAN giới thiệu.
                                Phiên bản này đi kèm với lõi IPG Numerical điều
                                chỉnh tay kép độc đáo và một bộ tùy chọn lò xo
                                GES dự phòng
                            </p>
                            <p>
                                Thật dễ dàng để cảm thấy tốc độ cải thiện rõ
                                rệt. Khối rubik GAN 356 M có thể điều chỉnh độ
                                kín tùy theo sở thích riêng của mình để có được
                                cảm giác phù hợp hơn khi chơi tốc độ
                            </p>

                            <p style={{ textAlign: "center" }}>
                                <img
                                    height="500px"
                                    src={product.image_url}
                                    width="500px"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="https://rubikstore.vn/cdn/upload/images/1030392700x.jpg"
                                />
                            </p>

                            <p>
                                <strong>
                                    {product.name} với lõi Numerical IPG
                                    có thể điều chỉnh kép với lò xo GES đi kèm.
                                    Đây là phiên bản đủ lò xo GES dự phòng đi
                                    kèm.
                                </strong>
                            </p>

                            <p>* Thông Số kỹ thuật</p>
                            <p>
                                - Thương hiệu: GAN <br />
                                - Vật chất: Nhựa ABS <br />
                                - Kích thước (tính bằng mm): 56 x 56 x 56 <br />
                                - Trọng lượng sản phẩm (tính bằng gam): 74 <br />
                                - Trọng lượng gói (tính bằng gam): 210 <br />
                                - Bảng màu: Tiêu chuẩn <br />
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gợi ý này */}
                <aside className="product-detail__sidebar">
                    <h3 className="sidebar-title">Sản phẩm tương tự</h3>
                    <div className="suggested-products">
                        {products.slice(0, 10).map((product, index) => (
                            <Link
                                href={`/detail_product/${product.slug}`}
                                key={index}
                            >
                                <div key={index} className="suggested-product">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                    />
                                    <div className="suggested-product__info">
                                        <p className="suggested-product__name">
                                            {product.name}
                                        </p>
                                        <p className="suggested-product__price">
                                            {typeof product.price === "string"
                                                ? product.price
                                                : formatPrice(product.price)}
                                            đ
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

ProductDetail.getLayoutWeb = function getLayoutWeb(page) {
    return page;
};

export default ProductDetail;
