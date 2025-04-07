import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";

import productService from "../services/productService";

const SearchProduct = () => {
    const searchRef = useRef(null);

    const [ searchWord, setSearchWord ] = useState("");
    const [ products, setProducts ] = useState([]);
    const [ filteredProducts, setFilteredProducts ] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllproducts();
                setProducts(data || []);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);


    useEffect(() => {
        if(searchWord === "") {
            setFilteredProducts([]);
            return;
        }

        // Lọc sản phẩm từ từ khóa
        if (products.length > 0) {
            const filter = products.filter(product =>
                product.name.toLowerCase().includes(searchWord.toLowerCase())
            )
            console.log("đây là filter lọc sản phẩm", filter)
            setFilteredProducts(filter);
        }

    }, [searchWord, products])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchWord(""); 
                setFilteredProducts([]); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchWord(e.target.value);
    };

    const handleProductClick = () => {
        setSearchWord(""); 
        setFilteredProducts([]); 
    };

    return (
        <div className="search-site" ref={searchRef}>
            <form>
                <input
                    className="text-search"
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchWord}
                    onChange={handleSearchChange}
                />
                <button className="btn-search" type="submit">
                    <i className="fa-solid fa-magnifying-glass" style={{ backgroundColor: 'white', color: 'black' }}></i>
                </button>
            </form>

            {/* Hiển thị kết quả tìm kiếm */}
            {searchWord && (
                <div className="search-results" style={{position: 'absolute', backgroundColor: 'white', border: '1px solid #ddd', width: '100%', maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Link href={`/detail_product/${product.slug}`} key={product.id_product} onClick={handleProductClick}>
                                <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', display: "flex"}}>
                                    <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                    <div className='hidden_claim'>
                                        <span>{product.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#888', marginLeft: "10px" }}>
                            Không tìm thấy sản phẩm nào phù hợp!
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}

export default SearchProduct;