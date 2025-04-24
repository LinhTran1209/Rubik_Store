import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import userService from '../../services/userService';
import CustomToast from '../../components/CustomToast';

const Register = () => {
    const toast = useRef(null);
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isSendCodeDisabled, setIsSendCodeDisabled] = useState(false);

    const getAllusers = async () => {
        try {
            const data = await userService.getAllusers();
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu người dùng', life: 1200 });
        }
    };

    useEffect(() => {
        getAllusers();
    }, []);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGeneratedCode('');
                        setIsSendCodeDisabled(false);
                        toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mã xác nhận đã hết hiệu lực', life: 1200 });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    
    const checkInput = () => {
        if (!name) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Họ và tên không được để trống', life: 1200 });
            return false;
        }
        if (name.length < 2) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Họ và tên phải có ít nhất 2 ký tự', life: 1200 });
            return false;
        }
        
        const phoneRegex = /^0\d{9}$/;
        if (!phone) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại không được để trống', life: 1200 });
            return false;
        }
        if (!phoneRegex.test(phone)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại phải có đúng 10 số', life: 1200 });
            return false;
        }
        if (users.some((user) => user.phone === phone)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã được sử dụng', life: 1200 });
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email không được để trống', life: 1200 });
            return false;
        }
        if (!emailRegex.test(email)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email không hợp lệ', life: 1200 });
            return false;
        }
        if (users.some((user) => user.email === email)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã được sử dụng', iife: 1200 });
            return false;
        }
        
        if (!password) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mật khẩu không được để trống', life: 1200 });
            return false;
        }
        if (password.length < 6) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mật khẩu phải có ít nhất 6 ký tự', life: 1200 });
            return false;
        }
        
        if (!confirmPassword) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập lại mật khẩu', life: 1200 });
            return false;
        }
        if (confirmPassword !== password) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mật khẩu nhập lại không khớp', life: 1200 });
            return false;
        }
        
        if (!verificationCode) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mã xác nhận không được để trống', life: 1200 });
            return false;
        }
        if (verificationCode !== generatedCode) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mã xác nhận không đúng', life: 1200 });
            return false;
        }
        if (countdown === 0 && generatedCode) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mã xác nhận đã hết hiệu lực', life: 1200 });
            return false;
        }
        return true;
    }
    
    const sendVerificationCode = async () => {
        if (checkInput() === false) return;

        const newCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        setGeneratedCode(newCode);
        setCountdown(60);
        setIsSendCodeDisabled(true);

        try {
            await userService.sendVerificationEmail(email, newCode);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Mã xác nhận đã được gửi tới email của bạn', life: 1200 });
        } catch (error) {
            console.error('Lỗi khi gửi email:', error.message);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể gửi mã xác nhận, vui lòng thử lại', life: 1200 });
            setIsSendCodeDisabled(false);
            setCountdown(0);
            setGeneratedCode('');
        }
    };
    
    const handleRegister = async () => {
        if (checkInput() === false) return; 
        try {
            await userService.adduser({ role: 'customer', name, phone, email, password });
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký tài khoản thành công', life: 1200 });
            router.push('/home');
        } catch (err) {
            const errorMessage = err.message || 'Đăng ký thất bại';
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: errorMessage, life: 1200 });
        }
    };

    return (
        <div className="modal">
            <CustomToast ref={toast} />
            <div className="modal__body">
                <div className="auth-form auth-form__register">
                    <div className="auth-form__container">
                        <div className="auth-form__header">
                            <h3 className="auth-form__heading">ĐĂNG KÝ TÀI KHOẢN</h3>
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
                                    placeholder=" Số điện thoại"
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
                                    <button
                                        className="btn-very"
                                        onClick={sendVerificationCode}
                                        disabled={isSendCodeDisabled}
                                    >
                                        {isSendCodeDisabled ? 'Đã gửi mã' : 'Nhận mã qua Email'}
                                    </button>
                                    {countdown > 0 && (
                                        <span className="countdown" style={{
                                            margin: "auto"
                                        }}>
                                            Hết hiệu lực sau: {countdown} giây
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="auth-form__group">
                                <div className="group-btn">
                                    <button onClick={handleRegister} className="btn btn-register">
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
                                    Khi đăng ký, bạn đồng ý với Rubik Ocean về <br />
                                    <a className="link-policy" href="">
                                        Điều khoản dịch vụ
                                    </a>{' '}
                                    & <a className="link-policy" href="">Chính sách bảo mật</a>
                                </div>

                                <div className="have_account">
                                    Đã có tài khoản?{' '}
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