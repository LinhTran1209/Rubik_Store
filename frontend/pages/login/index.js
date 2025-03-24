import React, { useRef, useState, useEffect } from 'react';
import CustomToast from '../../components/CustomToast';
import loginService from '../../services/authService';
import { Toast } from 'primereact/toast';
import Link from 'next/link';


const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const toast = useRef(null);

    const handleLogin = async () => {
        if (!phone || !password) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }

        try {
            const response = await loginService.login(phone, password);
            const user = response.user;

            if (!user) {
                throw new Error('Không nhận được thông tin user từ server');
            }

            if (user.role === 'admin') {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000 });
                window.location.href = '/manage/news';
            } else if (user.role === 'customer') {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000});
                // localStorage.setItem('user_customer', JSON.stringify(user));
                window.location.href = `/home?phone=${user.phone}`;
            } else {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Bạn không có quyền truy cập', life: 3000 });
                window.location.href = '/';
            }
        } catch (err) {
            const errorMessage = err.message || 'Đăng nhập thất bại';
            toast.current.show({ severity: 'info', summary: 'Thông báo', detail: errorMessage, life: 3000 });
        }
    };

    return (
        <div className="modal"> 
<CustomToast
                ref={toast}
            />
            <div className="modal__body">
                <div className="auth-form auth-form__login">
                    <div className="auth-form__container">
                        <div className="auth-form__header">
                            <h3 className="auth-form__heading">ĐĂNG NHẬP</h3>
                        </div>

                        <div className="auth-form__form">
                            <div className="auth-form__group">
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="text"
                                    className="auth-form__input"
                                    placeholder="Số điện thoại"
                                />
                                <div id="error_message-account-login" className="error_message"></div>
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    className="auth-form__input"
                                    placeholder="Mật khẩu"
                                />
                                <div id="error_message-pass-login" className="error_message"></div>
                            </div>

                            <div className="auth-form__group">
                                <div className="group-btn">
                                    <button className="btn btn-register" onClick={handleLogin}>
                                        ĐĂNG NHẬP
                                    </button>
                                </div>
                            </div>

                            <div className="auth-form__FB-GG">
                                <div className="auth-form__allLine">
                                    <div className="auth-form__line"></div>
                                    <span id="id_or">HOẶC</span>
                                    <div className="auth-form__line"></div>
                                </div>

                                <div className="auth-form__method">
                                    <div className="auth-form__icon">
                                        <button className="btn-iconFBGG">
                                            <div>
                                                <img className="icon-fbgg" src="/assets/img/fb1.png" alt="Facebook" />
                                            </div>
                                            <span className="text-icon-fbgg">Facebook</span>
                                        </button>
                                    </div>

                                    <div className="auth-form__icon">
                                        <button className="btn-iconFBGG">
                                            <div>
                                                <img className="icon-fbgg" src="/assets/img/gg1.png" alt="Google" />
                                            </div>
                                            <span className="text-icon-fbgg">Google</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="auth-form__agree-policy">
                                <div className="no_account">
                                    Bạn mới biết đến Rubik Ocean?{' '}
                                    <Link href="/register" className="btn-register" style={{ color: 'red', textDecoration: 'none' }}>
                                        Đăng ký
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Login.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default Login;