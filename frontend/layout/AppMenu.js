import React, { useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import loginService from '../services/loginService';

const AppMenu = () => {
    const { layoutConfig } = React.useContext(LayoutContext);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await loginService.getCurrentUser();
                console.log('User:', user);
                setUserRole(user.role);
            } catch (error) {
                console.error('không lấy được người dùng gần đây:', error);
                setUserRole(null); // Nếu không lấy được user, set userRole thành null
            } finally {
                setLoading(false);
            }
        };
        fetchUserRole();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/auth/logout', {
                method: 'POST'
            });
            console.log('Thực hiện đăng xuất');
            setUserRole(null);
            alert('Đăng xuất thành công');
            window.location.href = '/home';
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Đăng xuất thất bại, vui lòng thử lại.');
        }
    };

    const model = [
        {
            label: 'Trang quản lý',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages/manage/',
            items: [
                ...(userRole === 1 ? [
                    { label: 'Quyền hạn', icon: 'pi pi-fw pi-globe', to: '/manage/roles' },
                    { label: 'Nhân viên', icon: 'pi pi-fw pi-globe', to: '/manage/employees' },
                    { label: 'Khách hàng', icon: 'pi pi-fw pi-globe', to: '/manage/customers' },
                    { label: 'Nhà cung cấp', icon: 'pi pi-fw pi-globe', to: '/manage/suppliers' },
                    { label: 'Loại sản phẩm', icon: 'pi pi-fw pi-globe', to: '/manage/categories' },
                    { label: 'Sản phẩm', icon: 'pi pi-fw pi-globe', to: '/manage/products' },
                    { label: 'Hóa đơn nhập', icon: 'pi pi-fw pi-globe', to: '/manage/buy_invoices' },
                    { label: 'Hóa đơn bán', icon: 'pi pi-fw pi-globe', to: '/manage/sale_invoices' }
                ] : []),
                ...(userRole ? [
                    { label: 'Đăng xuất', icon: 'pi pi-fw pi-sign-out', to: '/home', onClick: handleLogout }
                ] : [
                    { label: 'Đăng nhập', icon: 'pi pi-fw pi-sign-in', to: '/home' }
                ])
            ]
        }
    ];

    if (loading) return <div>Loading menu...</div>;

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => (
                    !item.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={i}></li>
                    )
                ))}
                <Link href="https://www.primefaces.org/primeblocks-react" target="_blank" style={{ cursor: 'pointer' }}>
                    {/* <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} /> */}
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;