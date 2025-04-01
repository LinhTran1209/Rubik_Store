import sale_invoiceService from "../../services/sale_invoiceService";
import userAddressService from "../../services/userAddressService";
import React, { useState, useEffect, useRef } from "react";
import CustomToast from "../../components/CustomToast";
import { formatPrice } from "../../utils/formatPrice";
import userService from "../../services/userService";
import authService from "../../services/authService";
import { formatDate } from "../../utils/formatDate";
import { useRouter } from 'next/router';
import Link from "next/link";

const Account = () => {
    // Lấy thông tin người dùng đã đăng nhập từ token chỉ có phone và role
    const [user, setUser] = useState({id_user: null, role: "", name: "", email: "", phone: ""});
    const [userRole, setUserRole] = useState({ phone: "", role: "" });
    const [sale_invoices, setSale_Invoices] = useState([]);
    const [userAddress, setUserAddress] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUserRole({ phone: user.phone, role: user.role });
            } catch (error) {
                setUserRole({ phone: "", role: "" });
            } finally {
                setLoading(false);
            }
        };
        fetchUserRole();
    }, []);

    // Lấy chính xác được user từ userRole bằng số phone
    const fetchUser = async () => {
        try {
            const user = await userService.getData("phone", userRole.phone);
            setUser(user[0]);
        } catch (err) {
            console.log(err.message, "ở account");
        }
    };

    // Lấy danh sách các địa chỉ của người dùng
    const fetchUser_Addresses = async () => {
        try {
            const user_addresses = await userAddressService.getData(
                "id_user",
                user.id_user
            );
            setUserAddress(user_addresses);
        } catch (err) {
            console.log(err.message, "ở account");
        }
    };

    // Lấy các hóa đơn của người dùng đăng nhập
    const fetchSale_invoices = async () => {
        try {
            const sale_invoices = await sale_invoiceService.getData(
                "id_user",
                user.id_user
            );
            setSale_Invoices(sale_invoices);
        } catch (err) {
            console.log(err.message, "ở account");
        }
    };

    // được mount vào khi tìm thấy người dùng gần
    useEffect(() => {
        if (userRole.phone) {
            fetchUser();
        }
    }, [userRole]);

    useEffect(() => {
        if (user) {
            fetchUser_Addresses();
            fetchSale_invoices();
        }
    }, [user]);

    const handleRowClick = (invoiceId) => {
        // window.location.href = `/orders/${invoiceId}`;
        router.push(`/order/${invoiceId}`);
    };

    const handleChangePassword = () => {
        // window.location.href = `/orders/${invoiceId}`;
        router.push(`/changepassword`);
    };

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
                {/* Phần bên trái hóa đơn đã mua */}
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
                            {user.id_user !== null ? (
                                sale_invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="td_center_account">
                                            Bạn chưa mua sản phẩm nào!
                                        </td>
                                    </tr>
                                ) : (
                                    sale_invoices.map((invoice) => (
                                        <tr
                                            key={invoice.id_sale_invoice}
                                            onClick={() => handleRowClick(invoice.id_sale_invoice)} 
                                        >
                                            <td>{invoice.id_sale_invoice}</td>
                                            <td>{formatDate(invoice.created_at)}</td>
                                            <td>{formatPrice(invoice.total)}</td>
                                            <td>
                                                {invoice.pay}
                                            </td>{" "}
                                            <td>{invoice.shipping_address}</td>{" "}
                                            <td>{invoice.desc}</td>
                                            <td>{invoice.status}</td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                <tr>
                                    <td colSpan={7} className="td_center_account">
                                        Vui lòng{" "}
                                        <Link
                                            href="/login"
                                            style={{ color: "red" }}
                                        >
                                            đăng nhập
                                        </Link>{" "}
                                        để xem hóa đơn!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* <!-- Phần bên phải thông tin khách hàng--> */}
                <div className="right-section">
                    <h3>TÀI KHOẢN CỦA BẠN</h3>
                    <ul>
                        <li>
                            <img
                                src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/user.svg?1738317141988"
                                alt="icon"
                            />{" "}
                            Tên tài khoản: {user.name}
                        </li>
                        <li>
                            <img
                                src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/home.svg?1738317141988"
                                alt="icon"
                            />{" "}
                            Địa chỉ:
                        </li>
                        <li>
                            <img
                                src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/telephone.svg?1738317141988"
                                alt="icon"
                            />{" "}
                            Điện thoại: {user.phone}
                        </li>
                        <li>
                            <img
                                src="https://res.cloudinary.com/dzweargsr/image/upload/v1743411123/icon_email_ddhq4g.ico"
                                alt="icon"
                            />{" "}
                            Email: {user.email}
                        </li>
                        <li>
                            <img
                                src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/map-marker.svg?1738317141988"
                                alt="icon"
                            />{" "}
                            Địa chỉ mặc định:{" "}
                            {userAddress.length > 0
                                ? userAddress[0].address
                                : null}
                        </li>
                    </ul>
                    <div className="buttons">
                        <button className="address_user">
                            ĐỊA CHỈ ({userAddress.length})
                        </button>
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
