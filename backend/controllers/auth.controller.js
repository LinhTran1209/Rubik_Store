
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { setToken } = require('../jwt');
const Users = require('../models/users.model');

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Hãy điền đầy đủ tài khoản mật khẩu" });
  }

  try {
    const user = await Users.findByPhone(phone);

    if (!user) return res.status(401).json({ message: "Sai số điện thoại hoặc mật khẩu" });

    console.log('Đây là user: ', user);

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Sai số điện thoại hoặc mật khẩu" });

    // Tạo token 
    const token = jwt.sign(
      { phone: user.phone, role: user.role },process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    console.log('Đây là token login: ', token);

    // Lưu token vào cookie
    res.cookie('jwt_login', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 30 * 60 * 1000 // 30 phút
    });

    // Lưu token vào biến global do lưu vào cookie được, nhưng lấy ra méo được
    // setToken(token);

    // Trả về response thành công
    return res.json({
      message: 'Đăng nhập thành công',
      user: {
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};