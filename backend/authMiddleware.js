const jwt = require('jsonwebtoken');
const Employees = require('./models/employees.model');
const Customers = require('./models/customers.model');
const { getToken, deleteToken } = require('./jwt');

function verifyUser(verified, req, res, next) {
    const { phone, role, type } = verified;

    if (type === 'employee') {
        Employees.findByPhoneAndRole(phone, role, (err, user) => {
            if (err) return res.status(500).json({ message: 'Internal server error', error: err });
            if (!user) return res.status(403).json({ message: 'Không tìm thấy người dùng!' });
            if (user.id_role !== role || user.phone !== phone) {
                return res.status(403).json({ message: 'Thông tin của bạn đã thay đổi, vui lòng đăng nhập lại!' });
            }
            req.user = { phone, role, type };
            next();
        });
    } else if (type === 'customer') {
        Customers.findByPhoneAndRole(phone, role, (err, user) => {
            if (err) return res.status(500).json({ message: 'Internal server error', error: err });
            if (!user) return res.status(403).json({ message: 'Không tìm thấy người dùng!' });
            if (user.id_role !== role || user.phone !== phone) {
                return res.status(403).json({ message: 'Thông tin của bạn đã thay đổi, vui lòng đăng nhập lại!' });
            }
            req.user = { phone, role, type };
            next();
        });
    } else {
        return res.status(403).json({ message: 'Invalid user type' });
    }
}

function authenticateToken(req, res, next) {
    // const token = req.cookies.jwt;
    const token = getToken(req);

    // console.log('Đây là token lấy từ /auth/me',token);

    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để vào trang này!' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        verifyUser(verified, req, res, next);
    } catch (err) {
        res.status(403).json({ message: 'Không có Token' });
    }
}

module.exports = authenticateToken;