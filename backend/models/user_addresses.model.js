const db = require("../common/db");

const User_addresses = (user_address) => {
  this.id_address = user_address.id_address;
  this.id_user = user_address.id_user;
  this.name = user_address.name;
  this.address = user_address.address;
  this.phone = user_address.phone;
  this.is_default = user_address.is_default;
  this.created_at = user_address.created_at;
  this.updated_at = user_address.updated_at;
};

User_addresses.getData = (col, querydata, callback) => {
  const sqlString = `SELECT * FROM User_addresses WHERE ?? = ?`;
  db.query(sqlString, [col, querydata], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

User_addresses.getById = (id, callback) => {
  const sqlString = "SELECT * FROM User_addresses WHERE id_address = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

User_addresses.getAll = (callback) => {
  const sqlString = "SELECT * FROM User_addresses"; 
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

User_addresses.insert = async (user_address, callback) => {

  const sqlString = "INSERT INTO User_addresses SET ?"; 
  db.query(sqlString, user_address, (err, res) => {
    if (err) return callback(err);
    callback(null, { id: res.insertId, ...user_address });
  });
};

User_addresses.update = async (user_address, id, callback) => {

  const sqlString = "UPDATE User_addresses SET ? WHERE id_address = ?"; 
  db.query(sqlString, [user_address, id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật User_addresses có id = ${id} thành công`); 
  });
};

User_addresses.delete = (id, callback) => {
  const sqlString = "DELETE FROM User_addresses WHERE id_address = ?"; 
  db.query(sqlString, [id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa User_addresses có id = ${id} thành công`); 
  });
};

module.exports = User_addresses;