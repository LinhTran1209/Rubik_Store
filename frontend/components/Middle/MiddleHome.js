import React, { useEffect, useState } from 'react';
import productService from '../../services/productService'
import categorieService from '../../services/categorieService'

const MiddleHome = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllproducts();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllproducts();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const backImg = () => {
        // Logic để quay lại hình ảnh
    };

    const nextImg = () => {
        // Logic để chuyển đến hình ảnh tiếp theo
    };

    return (
        <div className="middle">
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
                    <img src="/assets/img/adv3.jpg" alt="" className="img-adv-small" /><br />
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

            {/* Sản phẩm của Rubik cơ bản */}
            <div className="container__middle-products">
                <div className="container__middle-products-title">
                    <div className="product-title">RUBIK CƠ BẢN</div>
                    <div className="extra-product-title">
                        <a href="rubik2x2x2.html">Rubik 2x2x2</a>
                        <a href="">Rubik 3x3x3</a>
                        <a href="">Rubik 4x4x4</a>
                        <a href="">Rubik 5x5x5</a>
                        <a href="">Rubik 6x6x6</a>
                        <a href="">Rubik 7x7x7</a>
                        <a href="">Xem tất cả</a>
                    </div>
                </div>
                <div className="products">
                    <ul className="homeproducts">
                        {/* Danh sách sản phẩm */}
                        {loading ? (
                            <li>Loading...</li>
                        ) : error ? (
                            <li className="error">{error}</li>
                        ) : (
                            products.slice(0, 10).map((product) => ( // Giới hạn hiển thị 10 sản phẩm
                                <li className="item-product" key={product.id_product}>
                                    {console.log(product)}
                                    <a href="">
                                        <img src={product.image_url} alt={product.name} className="img-item-product" />
                                        <h3>{product.name}</h3>
                                        <div className="price-item-product">
                                            <strong>{product.price}₫</strong>
                                            <span>{product.price}₫</span>
                                        </div>
                                    </a>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>


            {/* <!-- Sản phẩm của Rubik biến thể --> */}
            <div class="container__middle-products">
                <div class="container__middle-products-title">
                    <div class="product-title">RUBIK BIẾN THỂ</div>
                    <div class="extra-product-title">
                        <a href="#">Rubik Biến Thể 4 mặt</a>
                        <a href="#">Rubik Biến Thể 6 mặt</a>
                        <a href="#">Rubik Biến Thể 12 mặt</a>
                        <a href="#">Rubik Biến Thể Khác</a>
                        <a href="#">Xem tất cả</a>
                    </div>
                </div>
                
                     
            </div>

        </div>
    );
};

export default MiddleHome;