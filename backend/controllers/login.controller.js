const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employees = require('../models/employees.model');
const Customers = require('../models/customers.model');
const { setToken } = require('../jwt');


exports.login = (req, res) => {
    const { phone, password, id_role } = req.body;

    Employees.findByPhoneAndRole(phone, id_role, (err, employee) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error", error: err });
        }

        if (employee) {
            console.log('Đây là employee: ', employee);
            bcrypt.compare(password, employee.password, (err, isMatch) => {
                if (err) return res.status(500).json({ message: "Internal server error", error: err });
                if (isMatch) {
                    // Tạo ra token
                    const token = jwt.sign(
                        { phone: employee.phone, type: 'employee', role: employee.id_role },
                        process.env.JWT_SECRET,
                        { expiresIn: '30m' }
                    );


                    console.log('Đây là token login: ', token);
                    
                    // Lưu token vào cookie
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Lax', // cho phép gửi sang đường dẫn khác nó
                        path: '/', // Áp dụng cho mọi route
                        maxAge: 30 * 60 * 1000
                    });

                    // Lưu token vào biến global
                    setToken(token);


                    // console.log('Đây là token lưu: ', getToken(employee.phone));

                    return res.json({
                        message: 'Đăng nhập thành công',
                        user: {
                            phone: employee.phone,
                            type: 'employee',
                            role: employee.id_role
                        }
                    });
                }
                return res.status(401).json({ message: "Sai số điện thoại hoặc mật khẩu" });
            });
        } else {
            Customers.findByPhoneAndRole(phone, id_role, (err, customer) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error", error: err });
                }
                if (!customer) {
                    return res.status(401).json({ message: "Sai số điện thoại hoặc mật khẩu" });
                }
                bcrypt.compare(password, customer.password, (err, isMatch) => {
                    if (err) return res.status(500).json({ message: "Internal server error", error: err });
                    if (isMatch) {
                        const token = jwt.sign(
                            { phone: customer.phone, type: 'customer', role: customer.id_role },
                            process.env.JWT_SECRET,
                            { expiresIn: '30m' }
                        );
                        res.cookie('jwt', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'Strict',
                            maxAge: 30 * 60 * 1000
                        });



                        return res.json({
                            message: 'Đăng nhập thành công',
                            user: {
                                phone: customer.phone,
                                type: 'customer',
                                role: customer.id_role
                            }
                        });
                    }
                    return res.status(401).json({ message: "Sai số điện thoại hoặc mật khẩu" });
                });
            });
        }
    });
};