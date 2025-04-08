import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import Link from "next/link";

import sale_invoiceService from "../services/sale_invoiceService";
import { MenuProvider } from "./context/menucontext";
import authService from "../services/authService";
import AppMenuitem from "./AppMenuitem";

import { useUser } from "../components/UserContext";

const AppMenu = () => {
    const { user, loading } = useUser();
    const toast = useRef(null);
    const [saleInvoices, setSaleInvoices] = useState([]);

    const fetchSaleInvoices = async () => {
        try {
            const data = await sale_invoiceService.getAllsale_invoices();
            const dataFilter = data.filter((saleInvoice) => saleInvoice.request !== null);
            setSaleInvoices(dataFilter);
        } catch (err) {
            console.log(err.message, "ở appmenu");
        }
    };

    useEffect(() => {
        if (user.id_user) {
            fetchSaleInvoices();
        }
    }, [user]);

    useEffect(() => {
        if (saleInvoices.length > 0 && toast.current) {
            toast.current.show({
                severity: "info",
                summary: "Thông báo",
                detail: `Bạn đang có ${saleInvoices.length} yêu cầu từ khách hàng`,
                life: 3000,
            });
        }
    }, [saleInvoices]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Đăng xuất thành công",
                    life: 3000,
                });
            }
            window.location.href = "/home";
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Đăng xuất thất bại, vui lòng thử lại.");
        }
    };

    const model = [
        {
            label: "Trang quản lý",
            icon: "pi pi-fw pi-briefcase",
            to: "/pages/manage/",
            items: [
                ...(user.role === "admin"
                    ? [
                        { label: "Tin tức", icon: "pi pi-fw pi-megaphone", to: "/manage/news", key: "news" },
                        { label: "Người dùng", icon: "pi pi-fw pi-users", to: "/manage/users", key: "users" },
                        { label: "Loại sản phẩm", icon: "pi pi-fw pi-tags", to: "/manage/categories", key: "categories" },
                        { label: "Sản phẩm", icon: "pi pi-fw pi-box", to: "/manage/products", key: "products" },
                        { label: "Hóa đơn bán", icon: "pi pi-fw pi-file", to: "/manage/sale_invoices", key: "sale_invoices" },
                    ]
                    : []),
                {
                    key: user.role === "admin" ? "logout" : "login",
                    label: user.role === "admin" ? "Đăng xuất" : "Đăng nhập",
                    icon: user.role === "admin" ? "pi pi-fw pi-sign-out" : "pi pi-fw pi-sign-in",
                    command: user.role === "admin" ? handleLogout : () => { window.location.href = "/login"; },
                },
            ],
        },
    ];

    if (loading) return <div className="header__top">Đang tải...</div>;

    return (
        <MenuProvider>
            <Toast ref={toast} />
            <ul className="layout-menu">
                {model.map((item, i) =>
                    !item.separator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={i}></li>
                    )
                )}
                <Link href="https://www.primefaces.org/primeblocks-react" target="_blank" style={{ cursor: "pointer" }}>
                    {/* Nếu cần dùng LayoutContext thì uncomment và thêm logic */}
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;