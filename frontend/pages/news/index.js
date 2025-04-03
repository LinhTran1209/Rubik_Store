import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import newService from '../../services/newService';

import { formatDate } from '../../utils/formatDate';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const data = await newService.getAllnews();
            setNewsList(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách tin tức');
            console.log(err.message, 'ở news web');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="all__section">
            <div className="all__section-header">
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span>
                    <Link href="/news">Tin tức</Link>
                </span>
            </div>

            <div className="all__section-main">
                <span>TIN TỨC</span>

                {loading ? (
                    <div>Đang tải...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    Array.isArray(newsList) && newsList.length > 0 && (
                        <ul className="newslist">
                            {newsList.map((news) => (
                                <li key={news.id_new}>
                                    <div className="line-a"></div>
                                    <Link href={news.href || '#'}>
                                        <div className="tempvideo">
                                            <img
                                                src={news.image_url || '/assets/img-news/default.jpg'}
                                                alt={news.title}
                                                className="img-video"
                                            />
                                        </div>
                                        <div className="text-tempvideo" style={{ position: 'relative' }}>
                                            <h3>{news.title}</h3>
                                            <span style={{ marginTop: '20px' }}>
                                                {news.desc || 'Chưa có mô tả'}
                                            </span>
                                            <span style={{ position: 'absolute', color: '#b10000', right: '0', bottom: '0', fontSize: '12px' }}>
                                                Ngày đăng: {formatDate(news.created_at)}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </div>
    );
};

News.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default News;