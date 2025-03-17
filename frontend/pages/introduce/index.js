import React from "react";
import HeaderHome from "../../components/Header/HeaderHome";
import FooterHome from "../../components/Footer/FooterHome";
import Support from '../../components/Support';
import BackTop from '../../components/BackTop';


const Introduce = () => {
    return (
        <div id="top-app" className="app">
            <HeaderHome />
            {/* Phần middle */}
            <div className="middle">
                <div className="middle__all-text">
                    <div className="middle__all-text1">
                        <img style={{width: '100%' , height: '100%', marginBottom: '10px'}} src="/assets/img/introduce4.jpg" alt=""/>
                        <div className="middle__all-text-title">GIỚI THIỆU</div>
                        <div className="middle__all-text-main">
                            <span>
                                Dù mới gia nhập sân chơi Rubik chưa lâu nhưng Rubik Ocean Rubik đã phát triển nhanh chóng và chạm đến lòng tin của khách hàng
                                bằng những sản phẩm chất lượng, trải nghiệm mua sắm tối ưu và những giải đấu chuyên nghiệp với quy mô hàng đầu tại Việt Nam.
                                Rubik Ocean không chỉ hướng đến chất lượng sản phẩm tốt nhất, nâng cao 
                                chất lượng dịch vụ chăm sóc khách hàng mà còn mong muốn phát triển cộng đồng Rubik tại Việt Nam ngày càng lớn mạnh.
                            </span>
                        </div>
                    </div>

                    <div className="middle__all-text2">
                        <img style={{width: '200px', height: '200px', margin: 'auto'}} src="/assets/img/unnamed.jpg" alt=""/>         
                        <div className="middle__all-text-main">
                            <div className="middle__all-text-title">RUBIK OCEAN LÀ AI?</div>
                            <div className="middle__all-text-m">Rubik Ocean Rubik là nhà phân phối đồ chơi trí tuệ Rubik hàng đầu Việt Nam. Chúng tôi cam kết mang lại những sản phẩm chính hãng với giá thành phải chăng cùng trải nghiệm mua sắm tuyệt vời.</div>
                            <div className="middle__all-text-m">Rubik Ocean là đối tác trực tiếp với các thương hiệu Speedcube hàng đầu thế giới như Gan, Moyu, Qiyi,...</div>
                            <div className="middle__all-text-m">Rubik Ocean hân hạnh là nhà tài trợ chính, đồng hành cùng các thí sinh cuber trong các giải đấu quy mô hàng đầu tại Việt Nam.</div>
                        </div>
                    </div>

                    <div className="middle__all-text3">
                        <div className="middle__all-text-title">GIÁ TRỊ CỐT LÕI</div>
                        <div className="middle__all-text-main">
                            <div className="middle__all-text-main1">
                                <span>
                                    <strong className="strong__title">SẢN PHẨM CHẤT LƯỢNG</strong>
                                    - Chúng tôi luôn cố gắng mang đến những sản phẩm chính hãng, chất lương với nguồn gốc xuất xứ rõ ràng cùng mức giá phải chăng nhất
                                </span>
                            </div>

                            <div className="middle__all-text-main2">
                                <span>
                                    <strong className="strong__title">HƯỚNG ĐẾN NGƯỜI DÙNG</strong>
                                    - Rubik Ocean luôn đăt khách hàng làm trung tâm của dịch vụ bán hàng, đặt mình vào vị thế của người dùng để mang lại những dịch vụ trải nghiệm tốt nhất
                                </span>
                            </div>

                            <div className="middle__all-text-main3">
                                <span>
                                    <strong className="strong__title">PHÁT TRIỂN CỘNG ĐỒNG</strong>
                                    - Chúng tôi hướng đến mục đích xây dựng và phát triển cộng đồng Speedcubing Việt Nam ngày càng lành mạnh hơn
                                </span>
                            </div>
                        </div>
                        <img style={{width: '100%', height: '100%' }} src="/assets/img/adv2.jpg" alt="" />
                    </div>
                </div>              
            </div>

            <FooterHome />
            <Support />
            <BackTop />
        </div>
    );
};

Introduce.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};

export default Introduce;