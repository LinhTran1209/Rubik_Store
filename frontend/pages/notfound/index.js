import React from "react";
import Link from "next/link";
import AppConfig from "../../layout/AppConfig";

const NotFoundPage = () => {
    return (
        <div
            className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
            style={{ backgroundColor: "#f0f4f8" }}
        >
            <div className="flex flex-column align-items-center justify-content-center text-center">
                <img
                    src="https://res.cloudinary.com/dzweargsr/image/upload/v1742653489/favicon_mctiiz.ico"
                    alt="Rubik logo"
                    className="mb-5 w-8rem flex-shrink-0"
                    style={{
                        maxWidth: "120px",
                        display: "block",
                        margin: "0 auto",
                    }}
                />

                <div
                    className="surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                    style={{
                        borderRadius: "20px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        maxWidth: "600px",
                        width: "100%",
                        background: "#ffffff",
                    }}
                >
                    <span className="text-blue-600 font-bold text-8xl mb-3">
                        404
                    </span>
                    <h1 className="text-900 font-bold text-4xl mb-2">
                        Không tìm thấy
                    </h1>
                    <p className="text-600 mb-6 text-xl px-3">
                        Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Hãy
                        quay lại trang chủ hoặc thử một liên kết khác!
                    </p>

                    <Link href="/">
                        <button
                            className="p-button p-button-primary font-medium py-4 px-6 border-round"
                            style={{
                                backgroundColor: "#2196F3",
                                border: "none",
                                color: "#ffffff",
                                transition: "background-color 0.3s",
                                fontSize: "1.5rem",
                                display: "block",
                                margin: "0 auto",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#1976D2")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#2196F3")
                            }
                        >
                            Quay lại trang chủ
                        </button>
                    </Link>

                    <div className="mt-6 w-full">
                        <Link
                            href="/faq"
                            className="w-full flex align-items-center py-4 border-300 border-bottom-1"
                            style={{
                                justifyContent: "center", 
                            }}
                        >
                            <span
                                className="flex justify-content-center align-items-center bg-cyan-500 border-round"
                                style={{
                                    height: "4rem",
                                    width: "4rem",
                                    flexShrink: 0,
                                }}
                            >
                                <i className="text-50 pi pi-fw pi-table text-xl"></i>
                            </span>
                            <span
                                className="ml-4 flex flex-column text-center"
                                style={{
                                    flex: "0 1 auto", 
                                }}
                            >
                                <span className="text-900 font-medium text-xl">
                                    Câu hỏi thường gặp
                                </span>
                            </span>
                        </Link>
                        <Link
                            href="/support"
                            className="w-full flex align-items-center py-4 border-300 border-bottom-1"
                            style={{
                                justifyContent: "center", 
                            }}
                        >
                            <span
                                className="flex justify-content-center align-items-center bg-orange-500 border-round"
                                style={{
                                    height: "4rem",
                                    width: "4rem",
                                    flexShrink: 0,
                                }}
                            >
                                <i className="pi pi-fw pi-question-circle text-50 text-xl"></i>
                            </span>
                            <span 
                                className="ml-4 flex flex-column text-left"
                                style={{
                                    flex: "0 1 auto", 
                                    marginRight: "1.8rem"
                                }}
                            >
                                <span className="text-900 font-medium text-xl">
                                    Trung tâm hỗ trợ
                                </span>
                            </span>
                        </Link>
                        <Link
                            href="/permissions"
                            className="w-full flex align-items-center py-4"
                            style={{
                                justifyContent: "center", 
                            }}
                        >
                            <span
                                className="flex justify-content-center align-items-center bg-green-500 border-round"
                                style={{
                                    height: "4rem",
                                    width: "4rem",
                                    flexShrink: 0,
                                }}
                            >
                                <i className="pi pi-fw pi-unlock text-50 text-xl"></i>
                            </span>
                            <span 
                                className="ml-4 flex flex-column text-left"
                                style={{
                                    flex: "0 1 auto", 
                                    marginRight: "3.2rem"
                                }}>
                                <span className="text-900 font-medium text-xl">
                                    Quản lý quyền
                                </span>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Layout cho trang
NotFoundPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};

export default NotFoundPage;
