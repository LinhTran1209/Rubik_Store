var express = require('express');
var router = express.Router();
var authenticateToken = require('../authMiddleware');
const deleteToken = require('../jwt');

// Route lấy thông tin user hiện tại
router.get('/me', authenticateToken, (req, res) => {
    // console.log('Check thông tin user hiện tại');
    console.log('User info: ', req.user);
    res.json(req.user); 
});

// Route đăng xuất
router.post('/logout', (req, res) => {
    // console.log('Đã logout');
    res.clearCookie('jwt');
    deleteToken();
    res.json({ message: 'Đăng xuất thành công' });
});

module.exports = router;