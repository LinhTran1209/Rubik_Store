import React, { useState, useEffect, useRef } from 'react';
import bcrypt from 'bcryptjs';
import Link from 'next/link';

import CustomToast from "../../../components/CustomToast";
import { useUser } from "../../../components/UserContext";
import userService from '../../../services/userService';
import authService from "../../../services/authService";

const ChangePassword = () => {
    const { user, loading } = useUser();
    const toast = useRef(null);

    const [ confirmPasswordNew, setConfirmPasswordNew ] = useState('');
    const [ passwordNew, setPasswordNew ] = useState('');
    const [ password, setPassword ] = useState('');


    const checkInputChange = async () => {

        // Kiểm tra mật khẩu
        if (!password || !passwordNew || !confirmPasswordNew) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Vui lòng điền đầy đủ thông tin!',life: 1200,});
            return;
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mật khẩu cũ không chính xác!',life: 1200,});
            return;
        }

        if (passwordNew.length < 6 || confirmPasswordNew.length < 6) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mật khẩu mới phải có ít nhất 6 ký tự!',life: 1200,});
            return;
        }

        if (confirmPasswordNew !== passwordNew) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mật khẩu mới không khớp!',life: 1200,});
            return;
        }

        // Tiến hành thay đổi mật khẩu
        try {
            const userData = {...user}
            userData.password = passwordNew
            userData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            userData.created_at = new Date(new Date(userData.created_at).setDate(new Date(userData.created_at).getDate() + 1)).toISOString().split('T')[0];
            console.log(userData)
            userService.updateuser(userData.id_user, userData)   
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thay đổi mật khẩu thành công!', life: 1200 });
                    authService.logout();
                    window.location.href = "/home";
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thay đổi mật khẩu thất bại', life: 1200 });
                });
        } catch (err) {
            const errorMessage = err.message || 'Thay đổi mật khẩu thất bại';toast.current.show({severity: 'error',summary: 'Lỗi',detail: errorMessage,life: 5000,});
        }
    };

    if (loading) return <div className="header__top">Đang tải...</div>; 

    return (
        <div className="modal">
            <CustomToast ref={toast} />
            { (user.id_user === '' && !loading) ?
                (
                    <div style={{  margin: "auto", color: "#8a6d3b", textAlign: "center" }}>Bạn cần <Link style={{color:"red"}} href={`/login`}>đăng nhập</Link> để đổi mật khẩu!</div>
                ) : 
                (

            <div className="modal__body">
                <div className="auth-form auth-form__register">
                    <div className="auth-form__container">
                        <div className="auth-form__header">
                            <h3 className="auth-form__heading">ĐỔI MẬT KHẨU</h3>
                        </div>

                        <div className="auth-form__form">
                            <div className="auth-form__group">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="input-pass1"
                                    type="password"
                                    className="auth-form__input"
                                    placeholder="Mật khẩu cũ"
                                />
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={passwordNew}
                                    onChange={(e) => setPasswordNew(e.target.value)}
                                    id="input-pass2"
                                    type="password"
                                    className="auth-form__input"
                                    placeholder="Mật khẩu mới"
                                />
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={confirmPasswordNew}
                                    onChange={(e) => setConfirmPasswordNew(e.target.value)}
                                    id="input-pass3"
                                    type="password"
                                    className="auth-form__input"
                                    placeholder="Xác nhận mật khẩu mới"
                                />
                            </div>

                            <div className="auth-form__group">
                                <div className="group-btn">
                                    <button onClick={checkInputChange} className="btn btn-register">
                                        XÁC NHẬN
                                    </button>
                                </div>
                            </div>

                            <div className="back-to-account" style={{marginTop: "20px", fontWeight: 'bold', textAlign: "end"}}>
                                <Link href="/account" className="back-link" >
                                    <span className="arrow-icon" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <svg viewBox="0 0 512.076 512.076"  style={{width:"15px"}}>
                                            <path style={{fill: "rgb(55, 130, 23)"}} d="M178.5,140.25v-102L0,216.75l178.5,178.5V290.7c127.5,0,216.75,40.8,280.5,130.05C433.5,293.25,357,165.75,178.5,140.25z"></path>
                                        </svg>  
                                        Quay lại trang tài khoản
                                    </span> 
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                )
            }
        </div>
    );
};

ChangePassword.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default ChangePassword;