var express = require('express');
var router = express.Router();
var authenticateToken = require('../authMiddleware');

const authController = require('../controllers/auth.controller');
const {deleteToken} = require('../utils/jwt');


router.post('/login', authController.login);
router.post('/logout', (req, res) => {
    res.clearCookie('jwt_login');
    deleteToken();
    res.json({ message: 'Đăng xuất thành công' });
});


router.get('/me', authenticateToken, (req, res) => {
    console.log('User info: ', req.user);
    res.json(req.user); 
});


module.exports = router;