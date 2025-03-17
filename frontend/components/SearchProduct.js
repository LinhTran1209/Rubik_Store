import React from 'react';

const SearchProduct = () => {
    return (
        <div className="search-site">
            <input className="text-search" type="text" placeholder="Tìm kiếm sản phẩm..." />
            <button className="btn-search">
                <i className="fa-solid fa-magnifying-glass" style={{ backgroundColor: 'white', color: 'black' }}></i>
            </button>
        </div>
    )

}

export default SearchProduct;