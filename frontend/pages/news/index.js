import React from "react";


const News = () => {
    return (
        <div className="all__section">
            <div className="all__section-header">
                <span className="all__section-header-text"><a href="/home">Trang chủ</a></span>
                <span><a href="/news">Tin tức</a></span>
            </div>

            <div className="all__section-main">
                <span>TIN TỨC</span>
                <ul className="newslist">
                    <li>
                        <div className="line-a"></div>
                        <a href="manualRubik.html">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video1.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Hướng dẫn xoay rubik 3x3x3 theo cách đơn giản nhất</h3>
                                <span style={{ marginTop: '20px' }}>
                                    Hướng dẫn cách giải Rubik 3x3 và công thức rubik 3x3, đây là bài hướng dẫn 
                                    cách xoay rubik 3x3 cực kỳ đơn giản, dựa theo hướng dẫn của Leyan Lo
                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video2.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Các giai đoạn để trở thành 1 PRO rubik</h3>
                                <span>                        
                                    Nhằm giúp cho những người mới chơi hoặc đã biết chơi có cách rubik nâng cao và các giai đoạn rubik 1 cách nhanh hơn mình xin post bài này                    
                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video3.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Hướng dẫn giải Rubik 2x2x2 chỉ trong 2 phút</h3>
                                <span>
                                    cách xoay rubik 2x2x2, cách chơi rubik 2x2, hướng dẫn xoay rubik 2x2, hướng dẫn giải rubik 2x2 
                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video4.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Tổng hợp các mẫu Rubik rẻ nhất ngon nhất hiện nay</h3>
                                <span>
                                                        
                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video5.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Hướng dẫn giải rubik Pyraminx đơn giản nhất</h3>
                                <span>

                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video6.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Thuật ngữ và các ký hiệu liên quan đến rubik</h3>
                                <span>
                                                    
                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video7.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Hướng dẫn giải rubik 4x4x4 cách đơn giản nhất</h3>
                                <span>

                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video8.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Hướng dẫn mod nam châm cho Rubik Gan 356 RS 3x3 Stickerless</h3>
                                <span>

                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video9.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>57 công thức OLL - Công thức Rubik nâng cao</h3>
                                <span>

                                </span>
                            </div>
                        </a>
                    </li>


                    <li>
                        <div className="line-a"></div>
                        <a href="">
                            <div className="tempvideo">
                                <img src="/assets/img-news/video10.jpg" alt="" className="img-video"/>
                            </div>
                            <div className="text-tempvideo">
                                <h3>Video Hướng dẫn vệ sinh rubik cực nhanh</h3>
                                <span>

                                </span>
                            </div>
                        </a>
                    </li>


                </ul>
            </div>

        </div>

    );
};

News.getLayoutWeb = function getLayoutWeb(page) {
    return (
        {page}
    );
};

export default News;