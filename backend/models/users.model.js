const db = require("../common/db");
const bcrypt = require('bcrypt'); // Mã hóa mật khẩu bằng bcrypt

const Users = (users) => {
  this.id_user = users.id_user;
  this.role = users.role;
  this.name = users.name;
  this.email = users.email;
  this.phone = users.phone;
  this.password = users.password;
  this.status = users.status;
  this.created_at = users.created_at;
  this.updated_at = users.updated_at;
};

// Tìm kiếm mọi col sản phẩm theo querydata và trả về object
Users.getData = (col, querydata, callback) => {
  const sqlString = `SELECT * FROM Users WHERE ?? = ?`;
  db.query(sqlString, [col, querydata], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Hàm mã hóa mật khẩu
Users.hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {   
    throw new Error('Lỗi khi mã hóa mật khẩu: ' + err.message);
  }
};

// Để check auth
Users.findByPhone = (phone) => {
  return new Promise((resolve, reject) => {
    const sqlString = "SELECT * FROM users WHERE phone = ?";
    db.query(sqlString, phone, (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

Users.getById = (id, callback) => {
  const sqlString = "SELECT * FROM users WHERE id_user = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Users.getAll = (callback) => {
  const sqlString = "SELECT * FROM users ORDER BY id_user DESC"; 
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Users.insert = async (user, callback) => {
  try {
    if (user.password) {
      user.password = await Users.hashPassword(user.password);
    }

    const sqlString = "INSERT INTO users SET ?"; 
    db.query(sqlString, user, (err, res) => {
      if (err) return callback(err);
      callback(null, { id: res.insertId, ...user });
    });
  } catch (err) {
    callback(err);
  }
};

Users.update = async (user, id, callback) => {
  try {
    if (user.password) {
      user.password = await Users.hashPassword(user.password);
    }

    const sqlString = "UPDATE users SET ? WHERE id_user = ?"; 
    db.query(sqlString, [user, id], (err, res) => {
      if (err) return callback(err);
      callback(null, `Cập nhật Users có id = ${id} thành công`); 
    });
  } catch (err) {
    callback(err);
  }
};

Users.delete = (id, callback) => {
  const sqlString = "DELETE FROM users WHERE id_user = ?"; 
  db.query(sqlString, [id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa Users có id = ${id} thành công`); 
  });
};

module.exports = Users;