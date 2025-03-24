import React from 'react';
import Link from 'next/link';

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
                        <Link href="#" id="category">DANH MỤC SẢN PHẨM</Link>

                        <ul id="txt-banner-category">
                            <li id="rubik-basic">
                                <img className="icon-rubik" src="/assets/img/cube-3x3.png" alt="Rubik cơ bản" />
                                <Link href="#" id="a-rubik-basic">Rubik cơ bản</Link>

                                <ul id="txt-banner-rubik-basic">
                                    <li><Link href="/rubik2x2x2">Rubik 2x2x2</Link></li>
                                    <li><Link href="/rubik3x3x3">Rubik 3x3x3</Link></li>
                                    <li><Link href="/rubik4x4x4">Rubik 4x4x4</Link></li>
                                    <li><Link href="/rubik5x5x5">Rubik 5x5x5</Link></li>
                                    <li><Link href="/rubik6x6x6">Rubik 6x6x6</Link></li>
                                    <li><Link href="/rubik7x7x7">Rubik 7x7x7</Link></li>
                                    <li><Link href="#">Rubik 8x8x8</Link></li>
                                    <li><Link href="#">Rubik 9x9x9</Link></li>
                                </ul>
                            </li>
                            <li id="rubik-variant">
                                <img className="icon-rubik" src="/assets/img/cube-megaminx.png" alt="Rubik biến thể" />
                                <Link href="#" id="a-rubik-variant">Rubik biến thể</Link>

                                <ul id="txt-banner-rubik-variant">
                                    <li><Link href="#">Rubik Biến Thể 4 Mặt</Link></li>
                                    <li><Link href="#">Rubik Biến Thể 6 Mặt</Link></li>
                                    <li><Link href="#">Rubik Biến Thể 12 Mặt</Link></li>
                                    <li><Link href="#">Rubik Biến Thể Khác</Link></li>
                                    <li><Link href="#">Rubik Biến Thể Cao Cấp</Link></li>
                                </ul>
                            </li>
                            <li id="rubik-combo">
                                <img className="icon-rubik" src="/assets/img/cube-3x3.png" alt="Combo Rubik" />
                                <Link href="#" id="a-rubik-combo">Combo Rubik</Link>
                            </li>
                            <li id="rubik-accessory">
                                <img className="icon-rubik" src="/assets/img/cube-3x3.png" alt="Phụ kiện Rubik" />
                                <Link href="#" id="a-rubik-accessory">Phụ kiện Rubik</Link>

                                <ul id="txt-banner-rubik-accessory">
                                    <li><Link href="#">Stickers - Đề can dán rubik</Link></li>
                                    <li><Link href="#">Core & Ốc</Link></li>
                                    <li><Link href="#">Silicone - Dầu bôi trơn</Link></li>
                                    <li><Link href="#">Đồng hồ bấm giờ Rubik - Thảm kê Rubik</Link></li>
                                    <li><Link href="#">Keychain - Móc khóa Rubik</Link></li>
                                    <li><Link href="#">Bag - Túi đựng Rubik</Link></li>
                                    <li><Link href="#">Stand - Đế Rubik</Link></li>
                                    <li><Link href="#">Logo Rubik các hãng</Link></li>
                                </ul>
                            </li>
                            <li id="rubik-spiner">
                                <img className="icon-rubik" src="/assets/img/cube-spiner.png" alt="Spiner - Figdet" />
                                <Link href="#" id="a-rubik-spiner">Spiner - Figdet</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li><Link href="/home">TRANG CHỦ</Link></li>
                <li><Link href="/introduce">GIỚI THIỆU</Link></li>
                <li><Link href="/news">TIN TỨC</Link></li>
                <li><Link href="/instruct">HƯỚNG DẪN CHƠI</Link></li>
                <li><Link href="#all-contact" id="to-contact">LIÊN HỆ</Link></li>
            </ul>
        </div>
    );
};

export default HeaderNav;