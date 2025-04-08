import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

import sale_invoiceService from "../../services/sale_invoiceService";
import userAddressService from "../../services/userAddressService";
import { useUser } from "../../components/UserContext";

import CustomToast from "../../components/CustomToast";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";

const Account = () => {
    const { user, loading } = useUser();
    const router = useRouter();
    const toast = useRef(null);

    const [ sale_invoices, setSale_Invoices ] = useState([]);
    const [ userAddress, setUserAddress ] = useState([]);

    // Lấy danh sách các địa chỉ của người dùng
    const fetchUser_Addresses = async () => {
        try {
            const user_addresses = await userAddressService.getData("id_user", user.id_user);
            setUserAddress(user_addresses);
        } catch (err) {
            console.log(err.message, "ở account");
        }
    };

    // Lấy các hóa đơn của người dùng đăng nhập
    const fetchSale_invoices = async () => {
        try {
            const sale_invoices = await sale_invoiceService.getData("id_user", user.id_user);
            setSale_Invoices(sale_invoices);
        } catch (err) {
            console.log(err.message, "ở account");
        }
    };

    useEffect(() => {
        if (user) {
            fetchUser_Addresses();
            fetchSale_invoices();
        }
    }, [user]);

    const handleRowClick = (invoiceId) => {
        router.push(`/account/orders/${invoiceId}`);
    };

    const handleChangePassword = () => {
        router.push(`/account/changepassword`);
    };

    const handleAddress = () => {
        router.push(`/account/addresses`);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Đang xác nhận':
                return '#FFC107'; // Màu vàng
            case 'Đang lấy hàng':
                return '#00BCD4'; // Màu xanh dương
            case 'Đang giao hàng':
                return '#FF9800'; // Màu cam
            case 'Hoàn thành':
                return 'green'; // Màu xanh lá
            case 'Đã hủy đơn':
                return 'red'; // Màu đỏ
            default:
                return 'red'; 
        }
    };

    if (loading) return <div className="header__top">Đang tải...</div>; 

    return (
        <div className="all__middle">
            <CustomToast ref={toast} />
            <div className="all__section-header" style={{ marginLeft: "30px" }}>
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span>
                    <Link href="/account">Tài khoản</Link>
                </span>
            </div>

            <div className="middle_main">
                {/* Bến trái: hóa đơn mua */}
                <div className="left-section">
                    <h2>THÔNG TIN TÀI KHOẢN</h2>
                    <p>Xin chào, {user.name} !</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Ngày tạo</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Chuyển đến</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {user.id_user !== "" ? (
                                sale_invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="td_center_account">
                                            Bạn chưa mua sản phẩm nào!
                                        </td>
                                    </tr>
                                ) : (
                                    sale_invoices.map((invoice) => {
                                        const st = invoice.status === "Đang xác nhận" && invoice.request === "Hủy đơn" ? "Yêu cầu hủy đơn" : invoice.status;
                                        return (
                                            <tr
                                                key={invoice.id_sale_invoice}
                                                onClick={() => handleRowClick(invoice.id_sale_invoice)} 
                                            >
                                                <td>{invoice.id_sale_invoice}</td>
                                                <td>{formatDate(invoice.created_at)}</td>
                                                <td>{formatPrice(invoice.total)}đ</td>
                                                <td>{invoice.pay}</td>
                                                <td>{userAddress.find((addr) => addr.id_address === invoice.id_address)?.address || "Không có địa chỉ"}</td>
                                                <td>{invoice.desc}</td>
                                                <td style={{ color: getStatusColor(st)}}>{st}</td>
                                            </tr>
                                        );
                                    })
                                    
                                )
                            ) : (
                                <tr>
                                    <td colSpan={7} className="td_center_account">
                                        Vui lòng{" "}
                                        <Link href="/login" style={{ color: "red" }}>
                                            đăng nhập
                                        </Link>{" "}
                                        để xem hóa đơn!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* <!-- Bên phải: thông tin khách hàng--> */}
                <div className="right-section">
                    <h3>TÀI KHOẢN CỦA BẠN</h3>
                    <ul>
                        <li>
                            <img src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/user.svg?1738317141988" alt="icon"/>{" "}
                            <strong>Tên tài khoản:</strong> {user.name}
                        </li>
                        <li>
                            <img src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/home.svg?1738317141988" alt="icon"/>{" "}
                            <strong>Địa chỉ:</strong> {userAddress.filter(addr => addr.status === "hiện").length}
                        </li>
                        <li>
                            <img src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/telephone.svg?1738317141988" alt="icon"/>{" "}
                            <strong>Điện thoại:</strong> {user.phone}
                        </li>
                        <li>
                            <img src="https://res.cloudinary.com/dzweargsr/image/upload/v1743411123/icon_email_ddhq4g.ico" alt="icon"/>{" "}
                            <strong>Email:</strong> {user.email}
                        </li>
                        <li>
                            <img src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/map-marker.svg?1738317141988" alt="icon"/>{" "}
                            <strong>Địa chỉ mặc định:</strong>{" "}
                            {userAddress.length > 0 && userAddress.find((address) => address.is_default === 1 && address.status === "hiện")
                                ? userAddress.find((address) => address.is_default === 1).address
                                : null
                            }
                        </li>
                    </ul>
                    <div className="buttons">
                        <button className="address_user" onClick={() => handleAddress()}>SỔ ĐỊA CHỈ ({userAddress.filter(addr => addr.status === "hiện").length})</button>
                        <button className="change_password" onClick={() => handleChangePassword()}>ĐỔI MẬT KHẨU</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Account.getLayoutWeb = function getLayoutWeb(page) {
    return page;
};

export default Account;
