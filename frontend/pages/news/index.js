import React, { useState, useEffect } from 'react';
import newService from '../../services/newService';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy danh sách tin tức từ API
    const fetchNews = async () => {
        try {
            setLoading(true);
            const data = await newService.getAllnews();
            setNewsList(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách tin tức');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="all__section">
            <div className="all__section-header">
                <span className="all__section-header-text">
                    <a href="/home">Trang chủ</a>
                </span>
                <span>
                    <a href="/news">Tin tức</a>
                </span>
            </div>

            <div className="all__section-main">
                <span>TIN TỨC</span>

                {loading ? (
                    <div>Đang tải...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <ul className="newslist">
                        {newsList.map((news) => (
                            <li key={news.id}>
                                <div className="line-a"></div>
                                <a href={news.href || '#'}>
                                    <div className="tempvideo">
                                        <img
                                            src={news.image_url || '/assets/img-news/default.jpg'}
                                            alt={news.title}
                                            className="img-video"
                                        />
                                    </div>
                                    <div className="text-tempvideo">
                                        <h3>{news.title}</h3>
                                        <span style={{ marginTop: '20px' }}>
                                            {news.desc || 'Chưa có mô tả'}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

News.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default News;