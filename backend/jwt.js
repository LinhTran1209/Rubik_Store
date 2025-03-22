
let token = ''

function setToken(data) {
    token = data;
    console.log('Đây là token lưu vào cục bộ ', token);
}

function getToken() {
    return token;
}

function deleteToken() {
    console.log('Đã xóa token')
    token = '';
}

module.exports = { setToken, getToken, deleteToken };