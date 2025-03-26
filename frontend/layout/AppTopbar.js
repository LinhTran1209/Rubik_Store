import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { classNames } from 'primereact/utils';
import Link from 'next/link';

import authService from '../services/authService'

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    
    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));



    // Load người dùng
    const [user, setUser] = useState({ phone: "", role: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUser({ phone: user.phone, role: user.role });
            } catch (error) {
                console.error("Không lấy được người dùng gần đây:", error);
                setUser({ phone: "", role: "" });
            }
        };
        fetchUser();
    }, []);


    return (
        <div className="layout-topbar" style={{backgroundColor:'#438F23'}}>
            <Link href="#" className="layout-topbar-logo">
                <img src="/assets/img/logo.png"  alt="logo" />
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button> */}
                {user.role === 'admin' ? <span style={{ color: 'white', marginTop: '8.5%' }}>{user.phone}</span> : null}
                <button type="button" className="p-link layout-topbar-button" style={{marginRight: "50px"}}>
                    <i className="pi pi-user"></i>
                </button>
                <Link href="/documentation">
                    {/* <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button> */}
                </Link>
            </div>
        </div>
    );
});

export default AppTopbar;
