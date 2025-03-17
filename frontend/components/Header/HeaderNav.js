import React from 'react';

const HeaderNav = () => {
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
                        <a id="category" href="#">DANH MỤC SẢN PHẨM</a>

                        <ul id="txt-banner-category">
                            <li id="rubik-basic">
                                <img className="icon-rubik" src="/assets/img/cube-3x3.png" alt="Rubik cơ bản" />
                                <a id="a-rubik-basic" href="#">Rubik cơ bản</a>

                                <ul id="txt-banner-rubik-basic">
                                    <li><a href="/rubik2x2x2">Rubik 2x2x2</a></li>
                                    <li><a href="/rubik3x3x3">Rubik 3x3x3</a></li>
                                    <li><a href="/rubik4x4x4">Rubik 4x4x4</a></li>
                                    <li><a href="/rubik5x5x5">Rubik 5x5x5</a></li>
                                    <li><a href="/rubik6x6x6">Rubik 6x6x6</a></li>
                                    <li><a href="rubik7x7x7">Rubik 7x7x7</a></li>
                                    <li><a href="#">Rubik 8x8x8</a></li>
                                    <li><a href="#">Rubik 9x9x9</a></li>
                                </ul>
                            </li>
                            <li id="rubik-variant">
                                <img className="icon-rubik" src="/assets/img/cube-megaminx.png" alt="Rubik biến thể" />
                                <a id="a-rubik-variant" href="#">Rubik biến thể</a>

                                <ul id="txt-banner-rubik-variant">
                                    <li><a href="#">Rubik Biến Thể 4 Mặt</a></li>
                                    <li><a href="#">Rubik Biến Thể 6 Mặt</a></li>
                                    <li><a href="#">Rubik Biến Thể 12 Mặt</a></li>
                                    <li><a href="#">Rubik Biến Thể Khác</a></li>
                                    <li><a href="#">Rubik Biến Thể Cao Cấp</a></li>
                                </ul>
                            </li>
                            <li id="rubik-combo">
                                <img className="icon-rubik" src="/assets/img/cube-3x3.png" alt="Combo Rubik" />
                                <a id="a-rubik-combo" href="#">Combo Rubik</a>
                            </li>
                            <li id="rubik-accessory">
                                <img className="icon-rubik" src="/assets/img/cube-3x3.png" alt="Phụ kiện Rubik" />
                                <a id="a-rubik-accessory" href="#">Phụ kiện Rubik</a>

                                <ul id="txt-banner-rubik-accessory">
                                    <li><a href="#">Stickers - Đề can dán rubik</a></li>
                                    <li><a href="#">Core & Ốc</a></li>
                                    <li><a href="#">Silicone - Dầu bôi trơn</a></li>
                                    <li><a href="#">Đồng hồ bấm giờ Rubik - Thảm kê Rubik</a></li>
                                    <li><a href="#">Keychain - Móc khóa Rubik</a></li>
                                    <li><a href="#">Bag - Túi đựng Rubik</a></li>
                                    <li><a href="#">Stand - Đế Rubik</a></li>
                                    <li><a href="#">Logo Rubik các hãng</a></li>
                                </ul>
                            </li>
                            <li id="rubik-spiner">
                                <img className="icon-rubik" src="/assets/img/cube-spiner.png" alt="Spiner - Figdet" />
                                <a id="a-rubik-spiner" href="#">Spiner - Figdet</a>
                            </li>
                        </ul>
                    </div>
                </li>                                        
                <li><a href="/home">TRANG CHỦ</a></li>
                <li><a href="/introduce">GIỚI THIỆU</a></li>
                <li><a href="/news">TIN TỨC</a></li>
                <li><a href="/instruct">HƯỚNG DẪN CHƠI</a></li>
                <li><a id="to-contact" href="#all-contact">LIÊN HỆ</a></li>
            </ul>
        </div>
    );
};

export default HeaderNav;