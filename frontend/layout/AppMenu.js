import React, { useEffect, useState, useRef } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import loginService from '../services/loginService';
import { Toast } from 'primereact/toast';

const AppMenu = () => {
    const { layoutConfig } = React.useContext(LayoutContext);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await loginService.getCurrentUser();
                console.log('User:', user);
                setUserRole(user.role);
            } catch (error) {
                console.error('Không lấy được người dùng gần đây:', error);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserRole();
    }, []);

    const handleLogout = async () => {
        try {
            await loginService.logout();
            setUserRole(null);
            // alert('Đăng xuất thành công');
            toast.current.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đăng xuất thành công',
                life: 30000,
            });
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
                ...(userRole === 'admin'
                    ? [
                          { label: 'Tin tức', icon: 'pi pi-fw pi-globe', to: '/manage/news' },
                          { label: 'Người dùng', icon: 'pi pi-fw pi-globe', to: '/manage/users' },
                          { label: 'Loại sản phẩm', icon: 'pi pi-fw pi-globe', to: '/manage/categories' },
                          { label: 'Sản phẩm', icon: 'pi pi-fw pi-globe', to: '/manage/products' },
                          { label: 'Hóa đơn bán', icon: 'pi pi-fw pi-globe', to: '/manage/sale_invoices' },
                      ]
                    : []),
                ...(userRole
                    ? [
                          {
                              label: 'Đăng xuất',
                              icon: 'pi pi-fw pi-sign-out',
                              command: handleLogout, // Gọi hàm handleLogout
                          },
                      ]
                    : [
                          { label: 'Đăng nhập', icon: 'pi pi-fw pi-sign-in', to: '/' },
                      ]),
            ],
        },
    ];

    if (loading) return <div>Loading menu...</div>;

    return (
        <MenuProvider>
            <Toast ref={toast}/>
            <ul className="layout-menu">
                {model.map((item, i) =>
                    !item.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={i}></li>
                    )
                )}
                <Link href="https://www.primefaces.org/primeblocks-react" target="_blank" style={{ cursor: 'pointer' }}>
                    {/* <img
                        alt="Prime Blocks"
                        className="w-full mt-3"
                        src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`}
                    /> */}
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;