import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import Link from "next/link";

import { MenuProvider } from "./context/menucontext";
import AppMenuitem from "./AppMenuitem";
import authService from "../services/authService";

import { useUser } from "../components/UserContext";

const AppMenu = () => {
    const { user, loading } = useUser();
    const toast = useRef(null);
    
    const handleLogout = async () => {
        try {
            await authService.logout();
            if (toast.current) {
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Đăng xuất thành công", life: 30000});
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
                          {
                              label: "Tin tức",
                              icon: "pi pi-fw pi-megaphone",
                              to: "/manage/news",
                              key: "/manage/news",
                          },
                          {
                              label: "Người dùng",
                              icon: "pi pi-fw pi-users",
                              to: "/manage/users",
                              key: "/manage/users",
                          },
                          {
                              label: "Loại sản phẩm",
                              icon: "pi pi-fw pi-tags",
                              to: "/manage/categories",
                              key: "/manage/categories",
                          },
                          {
                              label: "Sản phẩm",
                              icon: "pi pi-fw pi-box",
                              to: "/manage/products",
                              key: "/manage/products",
                          },
                          {
                              label: "Hóa đơn bán",
                              icon: "pi pi-fw pi-file",
                              to: "/manage/sale_invoices",
                              key: "/manage/sale_invoices",
                          },
                      ]
                    : []),
                ...(user.role === "admin"
                    ? [
                          {
                              key: "logout",
                              label: "Đăng xuất",
                              icon: "pi pi-fw pi-sign-out",
                              command: handleLogout,
                          },
                      ]
                    : [
                          {
                              key: "login",
                              label: "Đăng nhập",
                              icon: "pi pi-fw pi-sign-in",
                              command: () => {
                                window.location.href = "/login"; 
                                setTimeout(() => {
                                    window.location.href = "/login";
                                }, 100); 
                            },
                          },
                      ]),
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
                        <AppMenuitem
                            item={item}
                            root={true}
                            index={i}
                            key={item.label}
                        />
                    ) : (
                        <li className="menu-separator" key={i}></li>
                    )
                )}
                <Link
                    href="https://www.primefaces.org/primeblocks-react"
                    target="_blank"
                    style={{ cursor: "pointer" }}
                >
                    {/* Nếu cần dùng LayoutContext thì uncomment và thêm logic */}
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;