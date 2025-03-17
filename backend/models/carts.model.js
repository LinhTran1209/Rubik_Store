
const db = require("../common/db");

const Carts = (carts) => {
  this.id_customer = carts.id_customer;
  this.id_product = carts.id_product;
  this.quantity = carts.quantity;
  this.price = carts.price;
  this.created_at = carts.created_at;
  this.updated_at = carts.updated_at;

};

// Carts.getById = (id, callback) => {
//   const sqlString = "SELECT * FROM carts WHERE id = ?";
//   db.query(sqlString, [id], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

Carts.getById = (id_customer, id_product, callback) => {
  const sqlString = "SELECT * FROM carts WHERE id_customer = ? AND id_product = ?";
  db.query(sqlString, [id_customer, id_product], (err, result) => {
    if (err) return callback(err);
    callback(null, result); // Trả về bản ghi đầu tiên hoặc null
  });
};


Carts.getAll = (callback) => {
  const sqlString = "SELECT * FROM carts";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Carts.insert = (carts, callBack) => {
//   const sqlString = "INSERT INTO carts SET ?";
//   db.query(sqlString, carts, (err, res) => {
//     if (err) return callBack(err);
//     callBack(null, { id: res.insertId, ...carts });
//   });
// };

Carts.insert = (carts, callBack) => {
  const sqlString = "INSERT INTO carts SET ?";
  db.query(sqlString, carts, (err, res) => {
    if (err) return callBack(err);
    callBack(null, carts);
  });
};


// Carts.update = (carts, id, callBack) => {
//   const sqlString = "UPDATE carts SET ? WHERE id = ?";
//   db.query(sqlString, [carts, id], (err, res) => {
//     if (err) return callBack(err);
//     callBack(null, `Cập nhật Carts có id = + id + thành công`);
//   });
// };

Carts.update = (carts, id_customer, id_product, callback) => {
  const sqlString = "UPDATE carts SET ? WHERE id_customer = ? AND id_product = ?";
  db.query(sqlString, [carts, id_customer, id_product], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật Carts có id_customer = ${id_customer} và id_product = ${id_product} thành công`);
  });
};

Carts.delete = (id_customer, id_product, callback) => {
  const sqlString = "DELETE FROM carts WHERE id_customer = ? AND id_product = ?";
  db.query(sqlString, [id_customer, id_product], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa Carts có id_customer = ${id_customer} và id_product = ${id_product} thành công`);
  });
};

module.exports = Carts;
