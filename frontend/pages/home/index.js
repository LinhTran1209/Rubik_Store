import product_variantsService from "../../services/product_variantService"
import categorieService from "../../services/categorieService";
import productService from "../../services/productService";
import { formatPrice }  from "../../utils/formatPrice";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const productsData = await productService.getAllproducts();
            const variantsData = await product_variantsService.getAllVariants();
    
            // Lọc sản phẩm có biến thể và gán giá từ biến thể
            const productsWithVariants = productsData
                .map((product) => {
                    const variants = variantsData.filter((variant) => variant.id_product === product.id_product);
                    if (variants.length > 0) {
                        // Lấy giá thấp nhất từ các biến thể (hoặc logic khác tùy bạn)
                        const minPrice = Math.max(...variants.map((v) => v.price));
                        return { ...product, price: minPrice, variants };
                    }
                    return null; // Bỏ qua sản phẩm không có biến thể
                })
                .filter((product) => product !== null);
                
            const dataRandom = [...productsWithVariants].sort(() => Math.random() - 0.5);
            setProducts(dataRandom);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categorieService.getAllcategories();
            setCategories(data);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        Promise.all([fetchProducts(), fetchCategories()]).finally(() => setLoading(false));
    }, []);

    const groupedCategories = Object.values(
        categories.reduce((acc, categorie) => {
            const { desc, id_categorie } = categorie;
            if (!acc[desc]) {
                acc[desc] = { desc, id_categories: [] };
            }
            acc[desc].id_categories.push(id_categorie);
            return acc;
        }, {})
    );


    const filterProductsByCategoryIds = (idCategories) => {
        return products
            .filter((product) => idCategories.includes(product.id_categorie))
            .slice(0, 10);
    };

    
    const backImg = () => {};
    const nextImg = () => {};

    return (
        <>
            <div className="middle__header">
                <div className="middle__header-left">
                    <img src="/assets/img/adv1.jpg" alt="" className="img-adv-big" id="id-img-adv" />
                    <div className="middle__header-btn">
                        <div onClick={backImg} className="middle-btn-adv" id="btn-back-adv">
                            <i className="fa-solid fa-backward"></i>
                        </div>
                        <div onClick={nextImg} className="middle-btn-adv" id="btn-next-adv">
                            <i className="fa-solid fa-forward"></i>
                        </div>
                    </div>
                </div>
                <div className="middle__header-right">
                    <img src="/assets/img/adv3.jpg" alt="" className="img-adv-small" />
                    <br />
                    <img src="/assets/img/adv4.jpg" alt="" className="img-adv-small" />
                </div>
            </div>

            <div id="middle-line"></div>
            <div className="container__move-text">
                <div className="moving-text">
                    Chào mừng bạn đã đến thế giới Rubik Ocean của Lĩnh
                </div>
            </div>

            <div className="middle__header1">
                <img src="/assets/img/adv5.jpg" alt="" className="img-adv-info" />
                <img src="/assets/img/adv7.jpg" alt="" className="img-adv-info" />
                <img src="/assets/img/adv6.jpg" alt="" className="img-adv-info" />
            </div>

            {loading ? (
                <div style={{textAlign: 'center'}}>Loading...</div>
            ) : error ? (
                <div className="error" style={{textAlign: 'center'}}>{error}</div>
            ) : categories.length > 0 ? (
                groupedCategories.map((groupedCategorie) => (
                    <div className="container__middle-products" key={groupedCategorie.desc}>
                        <div className="container__middle-products-title">
                            <div className="product-title">{groupedCategorie.desc}</div>
                            <div className="extra-product-title">
                                {categories
                                    .filter((categorie) => categorie.desc === groupedCategorie.desc)
                                    .map((categorie) => (
                                        <Link key={categorie.id_categorie} href={`/category/${categorie.slug}`}>
                                            {categorie.name}
                                        </Link>
                                    ))}
                                {/* <Link href={`/category/${groupedCategorie.desc}`}>Xem tất cả</Link> */}
                            </div>
                        </div>
                        <div className="products">
                            <ul className="homeproducts">
                                {filterProductsByCategoryIds(groupedCategorie.id_categories).length > 0 ? (
                                    filterProductsByCategoryIds(groupedCategorie.id_categories).map(
                                        (product) => (
                                            <li className="item-product" key={product.id_product}>
                                                <Link href={`/detail_product/${product.slug}`}>
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="img-item-product"
                                                    />
                                                    <h3>{product.name}</h3>
                                                    <div className="price-item-product">
                                                        <strong>{formatPrice(product.price)}đ</strong>
                                                        <span>{formatPrice(product.price * 1.2)}đ</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li style={{ display: "flex", margin: "auto", color: "#8a6d3b", backgroundColor: "#fcf8e3" }}>Sản phẩm đang được cập nhật. Vui lòng quay lại sau!</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{textAlign: 'center'}}>Chưa có danh mục</div>
            )}
        </>
    );
};

Home.getLayoutWeb = function getLayoutWeb(page) {
    return page;
};

export default Home;