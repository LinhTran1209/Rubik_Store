import categorieService from "../../services/categorieService";
import React, { useState, useEffect } from "react";
import HeaderTop from './HeaderTop';
import HeaderNav from './HeaderNav';

const HeaderHome = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categorieService.getAllcategories();
            setCategories(data);
        } catch (err) {
            console.log(err.message, 'ở HeaderHome');
        } finally {
            setLoading(false);
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