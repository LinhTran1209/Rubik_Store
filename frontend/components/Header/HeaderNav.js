import React, { useContext, useRef, useState, useEffect } from "react";
import Link from "next/link";

const HeaderNav = ({ categories = []}) => {
    return (
        <div className="header__bottom">
            <ul id="txt-banner">
                <li>
                    <div id="all-li1">
                        <div id="line">
                            <i className="line-i"></i>
                            <i className="line-i"></i>
                            <i className="line-i"></i>
                        </div>
                        <Link href="#" id="category">
                            DANH MỤC SẢN PHẨM
                        </Link>

                        <ul id="txt-banner-category">
                            <li id="rubik-basic">
                                <img
                                    className="icon-rubik"
                                    src="/assets/img/cube-3x3.png"
                                    alt="Rubik cơ bản"
                                />
                                <Link href="#" id="a-rubik-basic">
                                    Rubik cơ bản
                                </Link>

                                <ul id="txt-banner-rubik-basic">
                                    {categories ? (
                                        categories.map((categorie) =>
                                            categorie.desc ===
                                            "Rubik cơ bản" ? (
                                                <li key={categorie.slug}>
                                                    <Link
                                                        href={`/${categorie.slug}`}
                                                    >
                                                        {categorie.name}
                                                    </Link>
                                                </li>
                                            ) : null
                                        )
                                    ) : (
                                        <li>
                                            <span>Không có danh mục</span>
                                        </li>
                                    )}
                                </ul>
                            </li>

                            <li id="rubik-variant">
                                <img
                                    className="icon-rubik"
                                    src="/assets/img/cube-megaminx.png"
                                    alt="Rubik biến thể"
                                />
                                <Link href="#" id="a-rubik-variant">
                                    Rubik biến thể
                                </Link>

                                <ul id="txt-banner-rubik-variant">
                                    {categories ? (
                                        categories.map((categorie) =>
                                            categorie.desc ===
                                            "Rubik biến thể" ? (
                                                <li key={categorie.slug}>
                                                    <Link
                                                        href={`/${categorie.slug}`}
                                                    >
                                                        {categorie.name}
                                                    </Link>
                                                </li>
                                            ) : null
                                        )
                                    ) : (
                                        <li>
                                            <span>Không có danh mục</span>
                                        </li>
                                    )}
                                </ul>
                            </li>



                            <li id="rubik-combo">
                                <img
                                    className="icon-rubik"
                                    src="/assets/img/cube-3x3.png"
                                    alt="Combo Rubik"
                                />
                                <Link href="#" id="a-rubik-combo">
                                    Combo Rubik
                                </Link>

                                <ul id="txt-banner-rubik-combo">
                                    {categories ? (
                                        categories.map((categorie) =>
                                            categorie.desc ===
                                            "Combo Rubik" ? (
                                                <li key={categorie.slug}>
                                                    <Link
                                                        href={`/${categorie.slug}`}
                                                    >
                                                        {categorie.name}
                                                    </Link>
                                                </li>
                                            ) : null
                                        )
                                    ) : (
                                        <li>
                                            <span>Không có danh mục</span>
                                        </li>
                                    )}
                                </ul>
                            </li>




                            <li id="rubik-accessory">
                                <img
                                    className="icon-rubik"
                                    src="/assets/img/cube-3x3.png"
                                    alt="Phụ kiện Rubik"
                                />
                                <Link href="#" id="a-rubik-accessory">
                                    Phụ kiện Rubik
                                </Link>

                                <ul id="txt-banner-rubik-accessory">
                                    {categories ? (
                                        categories.map((categorie) =>
                                            categorie.desc ===
                                            "Phụ kiện Rubik" ? (
                                                <li key={categorie.name}>
                                                    <Link
                                                        href={`/${categorie.slug}`}
                                                    >
                                                        {categorie.name}
                                                    </Link>
                                                </li>
                                            ) : null
                                        )
                                    ) : (
                                        <li>
                                            <span>Không có danh mục</span>
                                        </li>
                                    )}
                                </ul>
                            </li>
                            {/* <li id="rubik-spiner">
                                <img className="icon-rubik" src="/assets/img/cube-spiner.png" alt="Spiner - Figdet" />
                                <Link href="#" id="a-rubik-spiner">Spiner - Figdet</Link>
                            </li> */}
                        </ul>
                    </div>
                </li>
                <li>
                    <Link href="/home">TRANG CHỦ</Link>
                </li>
                <li>
                    <Link href="/introduce">GIỚI THIỆU</Link>
                </li>
                <li>
                    <Link href="/news">TIN TỨC</Link>
                </li>
                <li>
                    <Link href="/instruct">HƯỚNG DẪN CHƠI</Link>
                </li>
                <li>
                    <Link href="#all-contact" id="to-contact">
                        LIÊN HỆ
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default HeaderNav;
