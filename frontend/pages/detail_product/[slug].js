import categorieService from "../../services/categorieService";
import productService from "../../services/productService";
import { formatPrice } from "../../utils/formatPrice";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";


const ProductDetail = () => {
    const router = useRouter();
    const { slug } = router.query; // lấy từ routing động
    const [product, setProduct] = useState(null); // sẽ tra từ productService từ slug
    const [products, setProducts] = useState([]); // các sản phẩm gợi ý theo id_categories
    const [categorie, setCategorie] = useState([]); // lấy tên danh mục cho all__section-header
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true); 

    const fetchProduct = async () => {
        try {
            setLoading(true); 
            const data = await productService.getDataproducts("slug", slug);
            console.log("chi tiết", data[0]);
            setProduct(data[0]);
            setLoading(false); 
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchProductSuggested = async () => {
        if (product && product.id_categorie) {
            try {
                const data = await productService.getDataproducts("id_categorie", product.id_categorie);
                console.log("gợi ý", data);
                setProducts(data);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm gợi ý:", err); 
            }
        }
    };

    const fetchCategorie = async () => {
        try {
            if (product) {
                const data = await categorieService.getcategorieById(product.id_categorie);
                console.log("danh mục", data[0]);
                setCategorie(data[0]);
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh mục:", err); 
        }
    };

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    useEffect(() => {
        fetchProductSuggested();
        fetchCategorie();
    }, [product]);

    useEffect(() => {
        if (product && typeof product.price === "number") {
            setTotalPrice(product.price * quantity);
        }
    }, [product, quantity]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Sản phẩm không tồn tại</div>;



    return (
        <div className="product-detail">
            <div className="all__section-header">
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span className="all__section-header-text">
                    <Link href={`/${categorie.slug}`}>{categorie.name}</Link>
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
                    <div className="product-detail__images">
                        <div className="product-detail__main-image">
                            <img src={product.image_url} alt={product.name} />
                        </div>
                        <div className="product-detail__thumbnails">
                            <img src={product.image_url} alt="Thumbnail 1" />
                            <img src={product.image_url} alt="Thumbnail 2" />
                        </div>
                    </div>

                    {/* sản phẩm */}
                    <div className="product-detail__info">
                        <h1 className="product-detail__title">
                            {product.name} - SP005176
                        </h1>
                        <p className="product-detail__meta">Mã SP: {product.id_product} | Thương hiệu: GAN</p>
                        <div className="product-detail__rating">
                            <span className="stars">★★★★★</span>
                            <span className="rating-count"> (1 đánh giá)</span>
                        </div>
                        <div className="product-detail__price">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            <span className="original-price">{formatPrice(product.price + 50000)}</span>
                        </div>
                        <div className="product-detail__promotion">
                            <p className="promotion-title"><strong>ƯU ĐÃI KHUYẾN MÃI</strong></p>
                            <p className="promotion-item">✔ Freeship đơn hàng từ 200.000đ</p>
                        </div>
                        <div className="product-detail__color">
                            <p><strong style={{marginRight: '10px'}}>Màu sắc:</strong> Stickerless</p>
                        </div>
                        <div className="product-detail__quantity">
                            <label htmlFor="quantity"><strong>Số lượng:</strong></label>
                            <input
                                style={{ width: "50px", marginLeft: "10px", textAlign: "center" }}
                                type="number"
                                id="quantity"
                                value={quantity}
                                min="1"
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>
                        <div className="product-detail__total">
                            <p>
                                <strong className="total-label">Thanh toán:</strong>
                                <span className="total-price" style={{ color: '#e74c3c', marginLeft: '10px'}}>{formatPrice(totalPrice)}</span>
                            </p>
                        </div>
                        <div className="product-detail__actions">
                            <button className="btn btn--buy-now">
                                THÊM VÀO GIỎ HÀNG <br />
                            </button>
                            <button className="btn btn--add-to-cart">
                                GỌI TƯ VẤN <br /> 0344665810
                            </button>
                        </div>
                        <p className="product-detail__contact">
                            Hoặc gọi ngay để đặt mua: 0344665810 (8:00-20:00)
                        </p>
                    </div>
                </div>

                {/* Gợi ý này */}
                <aside className="product-detail__sidebar">
                    <h3 className="sidebar-title">Sản phẩm tương tự</h3>
                    <div className="suggested-products">
                        {products.slice(0, 10).map((product, index) => (
                            <Link href={`/detail_product/${product.slug}`} key={index}>
                                <div key={index} className="suggested-product">
                                    <img src={product.image_url} alt={product.name} />
                                    <div className="suggested-product__info">
                                        <p className="suggested-product__name">{product.name}</p>
                                        <p className="suggested-product__price">
                                            {typeof product.price === "string"
                                                ? product.price
                                                : formatPrice(product.price)}
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