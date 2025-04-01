const jwt = require('jsonwebtoken');
const Users = require('./models/users.model');
const { getToken } =require('./utils/jwt') 

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt_login;
  // console.log('Token lấy ra ở Middleware ', token);

  if (!token) return res.status(401).json({ message: 'Bạn cần đăng nhập để vào trang này!' });

  try {
    // Xác minh
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const { phone, role } = verified;

    // Tìm kiếm lại trong database có không?
    Users.findByPhone(phone)
      .then(user => {
        if (!user) {
          return res.status(403).json({ message: 'Không tìm thấy người dùng!' });
        }
        if (user.role !== role || user.phone !== phone) {
          return res.status(403).json({ message: 'Thông tin của bạn đã thay đổi, vui lòng đăng nhập lại!' });
        }

        // Gắn thông tin user vào req
        req.user = { phone, role };
        next();
      })
      .catch(err => {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
      });
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

module.exports = authenticateToken;