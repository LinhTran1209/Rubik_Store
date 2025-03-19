import React, { useEffect, useState } from 'react';
import roleService from '../../services/roleService'

const MiddleLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState('');

        // Gọi API để lấy danh sách vai trò
        useEffect(() => {
            const fetchService = async () => {
                try {
                    const data = await roleService.getAllroles();
                    setRoles(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchService();
        }, []);
    
        const handleLogin = async () => {
            try {
                const response = await axios.post('http://localhost:3000/login', {
                    username,
                    password,
                });
                if (response.data.token) {
                    // Lưu token vào localStorage hoặc state
                    setToken(response.data.token);
                    alert('Đăng nhập thành công!');
                } else {
                    alert('Sai username hoặc mật khẩu');
                }
            } catch (err) {
                console.error('Đăng nhập lỗi:', err);
                alert('Có lỗi xảy ra, vui lòng thử lại');
            }
        };
    

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await roleService.getAllroles();
                setRoles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, []);


    return (
        <div className="middle">
        <div className="modal">
            <div className="modal__body">
                {/* <!-- authen form login --> */}
                <div className="auth-form auth-form__login">
                    <div className="auth-form__container">
                        <div className="auth-form__header">
                            <h3 className="auth-form__heading">ĐĂNG NHẬP</h3>
                        </div>

                        <div className="auth-form__form">
                            <div className="auth-form__group">
                                {/* <input onblur="check_input_account_login()" id="input-account-login" type="text" className="auth-form__input" placeholder="Số điện thoại/Email"/>    */}

                                <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                        className="auth-form__input"
                                        placeholder="Số điện thoại/Email"
                                    />
                                <div id="error_message-account-login" className="error_message"></div>     
                            </div>
                            <div className="auth-form__group">
                                {/* <input onblur="check_input_pass_login()" id="input-pass-login" type="password" className="auth-form__input" placeholder="Mật khẩu"/>    */}

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
                                {/* <input  id="input-pass-login" type="role" className="auth-form__input" placeholder="Quyền"/>    */}
                                <input
                                        value={role}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="text"
                                        className="auth-form__input"
                                        placeholder="Quyền"
                                    />
                                <div id="error_message-pass-login" className="error_message"></div>    
                            </div>

                            <div className="auth-form__group">
                                <div className="group-btn">
                                    <button onclick="check_input_login()" className="btn btn-register">ĐĂNG NHẬP</button> 
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
                                            <div><img className="icon-fbgg" src="/assets/img/fb1.png" alt=""/></div>
                                            <span className="text-icon-fbgg">Facebook</span>
                                        </button>
                                    </div>

                                    <div className="auth-form__icon">
                                        <button className="btn-iconFBGG">
                                            <div><img className="icon-fbgg" src="/assets/img/gg1.png" alt=""/></div>
                                            <span className="text-icon-fbgg">Google</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="auth-form__agree-policy">    
                                <div className="no_account">
                                    Bạn mới biết đến Rubik Ocean?
                                    <a href="register.html" className="btn-register" style={{ color: 'red', textDecoration: 'none' }}>Đăng ký</a>
                                </div>
                            </div>
                        </div>
                    </div>           
                </div>  
            </div>
        </div>

        {/* <div id="successful_notifi">🎉🎉 Đăng nhập thành công 🎉🎉</div> */}

        {token && <div>Token đã lưu: {token}</div>}
    </div>
    );
};

export default MiddleLogin;