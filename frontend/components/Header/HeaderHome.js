import React, { useState, useEffect } from "react";

import categorieService from "../../services/categorieService";

import HeaderTop from './HeaderTop';
import HeaderNav from './HeaderNav';

const HeaderHome = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const data = await categorieService.getAllcategories();
            setCategories(data);
        } catch (err) {
            console.log(err.message, 'ở HeaderHome');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <header className="header">
            <HeaderTop />
            <HeaderNav categories={categories}/>
        </header>
    );
};

export default HeaderHome;