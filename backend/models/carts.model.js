
const db = require("../common/db");

const Carts = (carts) => {
  this.id_user = carts.id_user;
  this.id_variant = carts.id_variant;
  this.quantity = carts.quantity;
  this.price = carts.price;
  this.created_at = carts.created_at;
  this.updated_at = carts.updated_at;
};

Carts.getById = (id_user, callback) => {
  const sqlString = "SELECT * FROM carts WHERE id_user = ? ORDER BY created_at DESC";
  db.query(sqlString, id_user, (err, result) => {
    if (err) return callback(err);
    callback(null, result); 
  });
};


Carts.getAll = (callback) => {
  const sqlString = "SELECT * FROM carts ORDER BY created_at DESC";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


Carts.insert = (cart, callBack) => {
  const sqlString = "INSERT INTO carts SET ?";
  db.query(sqlString, cart, (err, res) => {
    if (err) return callBack(err);
    callBack(null, cart);
  });
};


Carts.update = (carts, id_user, id_variant, callback) => {
  const sqlString = "UPDATE carts SET ? WHERE id_user = ? AND id_variant = ?";
  db.query(sqlString, [carts, id_user, id_variant], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật Carts có id_user = ${id_user} và id_variant = ${id_variant} thành công`);
  });
};

Carts.delete = (id_user, id_variant, callback) => {
  const sqlString = "DELETE FROM carts WHERE id_user = ? AND id_variant = ?";
  db.query(sqlString, [id_user, id_variant], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa Carts có id_user = ${id_user} và id_variant = ${id_variant} thành công`);
  });
};

module.exports = Carts;
