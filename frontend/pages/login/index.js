import React, { useEffect, useState, useRef } from "react";
import roleService from '../../services/roleService';
import { Toast } from 'primereact/toast';
import loginService from '../../services/loginService';
// import authenticateToken from '../../../backend/authMiddleware'

const Login = () => {
    const [phone, setPhone] = useState(''); 
    const [password, setPassword] = useState('');
    const [idRole, setIdRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await roleService.getAllroles();
                setRoles(data);
            } catch (err) {
                setError(err.message);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách quyền', life: 3000 });
            }
        };
        fetchService();
    }, []);

    const handleLogin = async () => {
        if (!phone || !password || !idRole) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }

        try {
            const response = await loginService.login(phone, password, parseInt(idRole));
            const user = response.user;

            if (!user) {
                throw new Error('Không nhận được thông tin user từ server');
            }

            if (user.type === 'employee' && user.role === 1) {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000 });
                window.location.href = '/manage/categories';
            } else if (user.type === 'customer') {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000 });
                window.location.href = `/home?phone=${user.phone}`;
            } else {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Bạn không có quyền truy cập', life: 3000 });
                window.location.href = '/ok';
            }
        } catch (err) {
            const errorMessage = err.message || 'Đăng nhập thất bại';
            setError(errorMessage);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: errorMessage, life: 3000 });
        }
    };

    return (
        <div className="modal">
            <Toast ref={toast} />
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
                                <select
                                    value={idRole}
                                    onChange={(e) => setIdRole(e.target.value)}
                                    className="auth-form__input"
                                >
                                    <option value="">Chọn quyền</option>
                                    {roles.map((roleItem) => (
                                        <option key={roleItem.id_role} value={roleItem.id_role}>
                                            {roleItem.name}
                                        </option>
                                    ))}
                                </select>
                                <div id="error_message-role-login" className="error_message"></div>
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
                                            <div><img className="icon-fbgg" src="/assets/img/fb1.png" alt="" /></div>
                                            <span className="text-icon-fbgg">Facebook</span>
                                        </button>
                                    </div>

                                    <div className="auth-form__icon">
                                        <button className="btn-iconFBGG">
                                            <div><img className="icon-fbgg" src="/assets/img/gg1.png" alt="" /></div>
                                            <span className="text-icon-fbgg">Google</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="auth-form__agree-policy">
                                <div className="no_account">
                                    Bạn mới biết đến Rubik Ocean?
                                    <a href="/register" className="btn-register" style={{ color: 'red', textDecoration: 'none' }}>Đăng ký</a>
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