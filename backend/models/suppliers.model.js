
const db = require("../common/db");

const Suppliers = (suppliers) => {
  this.id_supplier = suppliers.id_supplier;
  this.name = suppliers.name;
  this.email = suppliers.email;
  this.phone = suppliers.phone;
  this.address = suppliers.address;
  this.status = suppliers.status;
  this.created_at = suppliers.created_at;
  this.updated_at = suppliers.updated_at;

};

Suppliers.getById = (id, callback) => {
  const sqlString = "SELECT * FROM suppliers WHERE id_supplier = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Suppliers.getAll = (callback) => {
  const sqlString = "SELECT * FROM suppliers";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Suppliers.insert = (suppliers, callBack) => {
  const sqlString = "INSERT INTO suppliers SET ?";
  db.query(sqlString, suppliers, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...suppliers });
  });
};

Suppliers.update = (suppliers, id, callBack) => {
  const sqlString = "UPDATE suppliers SET ? WHERE id_supplier = ?";
  db.query(sqlString, [suppliers, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Suppliers có id = + id + thành công`);
  });
};

Suppliers.delete = (id, callBack) => {
  db.query(`DELETE FROM suppliers WHERE id_supplier = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Suppliers có id = + id + thành công`);
  });
};

module.exports = Suppliers;
