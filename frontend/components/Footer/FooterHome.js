import React from 'react';

const FooterHome = () => {
    return (
        <div id="all-contact" className="footer">
            <div className="footer__left">
                <p><strong>CÔNG TY TNHH RUBIK OCEAN VIỆT NAM</strong></p>
                <p>Hotline: <strong>0344665810</strong></p>
                <p>Tel: 02466863684 - 0836561578 - 0903244145</p>
                <p><strong>-Hà Nội</strong>: Tầng 6, Ocean Kids-Royal Tea, Số 6 Dương Đình Nghệ, Cầu Giấy, Hà Nội</p>
                <p><strong>-Hưng Yên</strong>: Trịnh Mỹ, Ngô Quyền, Tiên Lữ, Hưng Yên</p>
                <p>Email: linh3789@gmail.com</p>
                <p>GPKD số 0106475927 do Sở Kế hoạch đầu tư Hà Nội cấp ngày 06/03/2014 - MST: 0106475927</p>
                <li className="social-link">
                        <a className="a-img-contact" href="">
                            <img className="img-contact" src="/assets/img/facebook.png" alt=""/>
                        </a>
                        <a className="a-img-contact" href="">
                            <img className="img-contact" src="/assets/img/messager.png" alt=""/>
                        </a>
                        <a className="a-img-contact" href="">
                            <img className="img-contact" src="/assets/img/zalo.png" alt=""/>
                        </a>
                        <a className="a-img-contact" href="">
                            <img className="img-contact" src="/assets/img/youtube.png" alt=""/>
                        </a>
                        <a className="a-img-payment" href="">
                            <img className="img-payment" src="/assets/img/payment.png" alt=""/>
                        </a>
                    </li>
            </div>

            <div className="footer__middle">
                <ul>
                    <li id="footer__middle-title">Thông Tin Công Ty</li>
                    <li><a href="#">Chính sách bảo mật thông tin</a></li>
                    <li><a href="#">Giới thiệu</a></li>
                    <li><a href="#">Điều khoản sử dụng</a></li>
                    <li><a href="#">Trung tâm bảo hành</a></li>
                    <li><a href="#">Liên hệ, góp ý</a></li>
                </ul>
            </div>

            <div className="footer__right">
                <ul>
                    <li id="footer__middle-title">Hỗ trợ khách hàng</li>
                    <li><a href="#">Chính sách đổi trả hàng</a></li>
                    <li><a href="#">Chính sách bảo hành</a></li>
                    <li><a href="#">Phương thức thanh toán</a></li>
                    <li><a href="#">Giao nhận và vận chuyển</a></li>
                    <li><a href="#">Câu hỏi thường gặp</a></li>
                </ul>
            </div>
        </div>
    );
};

export default FooterHome;