import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import userService from '../../services/userService';

import CustomToast from '../../components/CustomToast';

const Register = () => {
    const toast = useRef(null);
    const [users, setUsers] = useState([]);
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    // lấy thông tin tất cả người dùng để só sánh

    const getAllusers = async () => {
        try {
            const data = await userService.getAllusers();
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        getAllusers();
    }, []); 



    const checkInputRegister = async () => {
        if (!name) {
            toast.current.show({severity: 'warn', summary: 'Cảnh báo', detail: 'Họ và tên không được để trống', life: 3000,});
            return;
        }
        if (name.length < 2) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Họ và tên phải có ít nhất 2 ký tự',life: 3000,});
            return;
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^0\d{9}$/;
        if (!phone) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Số điện thoại không được để trống',life: 3000,});
            return;
        }
        if (!phoneRegex.test(phone)) {toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Số điện thoại phải là 10 số',life: 3000,
            });
            return;
        }
        if (users.some(user => user.phone === phone)) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Số điện thoại đã có trong danh sách',life: 3000,});
            return;
        }

        // Kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Email không được để trống',life: 3000,});
            return;
        }
        if (!emailRegex.test(email)) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Email không hợp lệ',life: 3000,});
            return;
        }
        if (users.some(user => user.email === email)) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Email đã có trong danh sách',life: 3000,});
            return;
        }

        // Kiểm tra mật khẩu
        if (!password) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mật khẩu không được để trống',life: 3000,});
            return;
        }
        if (password.length < 6) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mật khẩu phải có ít nhất 6 ký tự',life: 3000,});
            return;
        }

        // Kiểm tra nhập lại mật khẩu
        if (!confirmPassword) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Vui lòng nhập lại mật khẩu',life: 3000,});
            return;
        }
        if (confirmPassword !== password) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mật khẩu không khớp',life: 3000,});
            return;
        }

        // Kiểm tra mã xác nhận
        const correctCode = '9W5G';
        if (!verificationCode) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mã xác nhận không được để trống',life: 3000,});
            return;
        }
        if (verificationCode !== correctCode) {
            toast.current.show({severity: 'warn',summary: 'Cảnh báo',detail: 'Mã xác nhận không đúng',life: 5000,});
            return;
        }

        // Nếu không có lỗi, tiến hành đăng ký
        try {
            userService.adduser({ role: "customer", name: name, phone: phone, email: email , password: password })   
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký thành công', life: 3000 });
                    window.location.href = '/home';
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Đăng ký thất bại', life: 3000 });
                });
        } catch (err) {
            const errorMessage = err.message || 'Đăng ký thất bại';toast.current.show({severity: 'error',summary: 'Lỗi',detail: errorMessage,life: 5000,});
        }
    };

    return (
        <div className="modal">
            <CustomToast ref={toast} />
            <div className="modal__body">
                <div className="auth-form auth-form__register">
                    <div className="auth-form__container">
                        <div className="auth-form__header">
                            <h3 className="auth-form__heading">ĐĂNG KÝ</h3>
                        </div>

                        <div className="auth-form__form">
                            <div className="auth-form__group">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="input-name-register"
                                    type="text"
                                    className="auth-form__input"
                                    placeholder="Họ và tên"
                                />
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    id="input-phone-register"
                                    type="tel"
                                    className="auth-form__input"
                                    placeholder="Số điện thoại"
                                />
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="input-email-register"
                                    type="email"
                                    className="auth-form__input"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="input-pass1-register"
                                    type="password"
                                    className="auth-form__input"
                                    placeholder="Mật khẩu"
                                />
                            </div>
                            <div className="auth-form__group">
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    id="input-pass2-register"
                                    type="password"
                                    className="auth-form__input"
                                    placeholder="Nhập lại mật khẩu"
                                />
                            </div>
                            <div className="auth-form__group">
                                <div className="div_veri">
                                    <input
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        id="input-veri-register"
                                        type="text"
                                        className="auth-form__input auth-form__input-veri"
                                        placeholder="Mã xác nhận"
                                    />
                                    <img className="img-veri" src="/assets/img/verification.png" alt="Mã xác nhận" />
                                </div>
                            </div>
                            <div className="auth-form__group">
                                <div className="group-btn">
                                    <button onClick={checkInputRegister} className="btn btn-register">
                                        ĐĂNG KÝ
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
                                <div className="text-policy">
                                    Bằng việc đăng kí, bạn đã đồng ý với Rubik Ocean về <br />
                                    <a className="link-policy" href="">
                                        Điều khoản dịch vụ
                                    </a>{' '}
                                    & <a className="link-policy" href="">Chính sách bảo mật</a>
                                </div>

                                <div className="have_account">
                                    Bạn đã có tài khoản?{' '}
                                    <Link href="/login" className="btn-login" style={{ color: 'red', textDecoration: 'none' }}>
                                        Đăng nhập
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

Register.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default Register;