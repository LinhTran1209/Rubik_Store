import product_variantsService from "../../services/product_variantService"; 
import categorieService from "../../services/categorieService";
import productService from "../../services/productService";
import { formatPrice } from  "../../utils/formatPrice";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";


const ProductCategoreis = () => {
    const router = useRouter();
    const { slug_categories } = router.query; // lấy từ routing động

    // tránh trường hợp khi component mount xong mà chưa có dữ liệu (categorie)
    const [loading, setLoading] = useState(true); 


    // Tìm kiếm id_categories từ slug_categories
    const [categorie, setCategorie] = useState(null);
    const [categories, setCategories] = useState([]);

    const fetchCategorie = async () => {
        try {
            setLoading(true); 
            const categorie = await categorieService.getDatacategories("slug", slug_categories);
            setCategorie(categorie[0]);
            setLoading(false);
        } catch (err) {
            console.log(err.message);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const categories = await categorieService.getDatacategories("desc", categorie.desc);
            setCategories(categories);
        } catch (err) {
            console.log(err.message);
        }
    };

    // Lấy sản phẩm theo id_categorie
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const productsData = await productService.getDataproducts("id_categorie", categorie.id_categorie);
            const productsWithVariants = await Promise.all(
                productsData.map(async (product) => {
                    const variants = await product_variantsService.getData("id_product", product.id_product);
                    if (variants.length > 0) {
                        const minPrice = Math.min(...variants.map((v) => v.price));
                        return { ...product, price: minPrice, variants };
                    }
                    return null;
                })
            );
            const filteredProducts = productsWithVariants.filter((p) => p !== null);
            setProducts(filteredProducts);
            setTotalProducts(filteredProducts.length);
        } catch (err) {
            console.log(err.message);
        }
    };

    // được mount khi slug_categories thay đổi
    useEffect(() => {
        if (slug_categories) {
            fetchCategorie();
        }
    }, [slug_categories]);

    // được mount khi categorie thay đổi
    useEffect(() => {
        if (categorie) {
            fetchCategories();
            fetchProducts();
        }
    }, [categorie]);


    // Hàm sắp xếp sản phẩm
    const [sortOrder, setSortOrder] = useState("");
    const handleSort = (order) => {
        setSortOrder(order);
        const sortedProducts = [...products];
        if (order === "asc") {
            sortedProducts.sort((a, b) => a.price - b.price); // Giá từ thấp đến cao
        } else if (order === "desc") {
            sortedProducts.sort((a, b) => b.price - a.price); // Giá từ cao đến thấp
        }
        setProducts(sortedProducts);
    };

    // Phần hiển thị thêm nhiều sản phẩm
    const [displayCount, setDisplayCount] = useState(5);
    const [totalProducts, setTotalProducts] = useState(0);
    const loadMore = () => {
        setDisplayCount((prevCount) => prevCount + 5);
    };
    const displayedProducts = products.slice(0, displayCount);


    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="all__section">
            <div className="all__section-header">
                <span className="all__section-header-text"><Link href="/home">Trang chủ</Link></span>
                <span className="all__section-header-text"><Link href={`/home`}>{categorie.desc}</Link></span>
                <span className="all__section-header-text"><Link href={`/category/${categorie.slug}`}>{categorie.name}</Link></span>
            </div>
    
            <div className="all__section-col-main">
                <div className="all-section-select">
                    {categories.map((category) => (
                    <Link key={category.slug} href={`/category/${category.slug}`}>
                        {category.name}
                    </Link>
                    ))}
                </div>

                <div className="all__section-title">
                    <h1>{categorie.name}</h1>

                    <div className="all__section-sort">
                        <label htmlFor="sort">Sắp xếp</label>
                        <select id="sort" value={sortOrder} onChange={(e) => handleSort(e.target.value)}>
                            <option value="">Mặc định</option>
                            <option value="asc">Giá từ thấp đến cao</option>
                            <option value="desc">Giá từ cao đến thấp</option>
                        </select>
                    </div>
                </div>

                <div className="all__products">
                    <div className="products">
                        <ul className="homeproducts">
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map((product) => (
                                    <li className="item-product" key={product.id_product}>
                                        <Link href={`/detail_product/${product.slug}`}>
                                            <img src={product.image_url} alt={product.name} className="img-item-product" />
                                            <h3>{product.name}</h3>
                                            <div className="price-item-product">
                                                <strong>{formatPrice(product.price)}₫</strong>
                                                {product.price < product.price * 1.2 && ( <span>{formatPrice(product.price * 1.2)}₫</span>)}
                                            </div>
                                        </Link>
                                    </li>
                                ))) : (<li style={{ display: "flex", margin: "auto", color: "#8a6d3b", backgroundColor: "#fcf8e3" }}>Sản phẩm đang được cập nhật. Vui lòng quay lại sau!</li>
                            )}
                        </ul>
                    </div>
                </div>
  
                {displayCount < totalProducts && (
                    <div className="all__section-container-btn">
                        <div className="all__section-btn">
                            <button onClick={loadMore}>Xem thêm {categorie.name}</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};


ProductCategoreis.getLayoutWeb = function getLayoutWeb(page) {
  return page;
}

export default ProductCategoreis;