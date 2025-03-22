
const db = require("../common/db");

const Customers = (customers) => {
  this.id_customer = customers.id_customer;
  this.id_role = customers.id_role;
  this.name = customers.name;
  this.email = customers.email;
  this.phone = customers.phone;
  this.address = customers.address;
  this.status = customers.status;
  this.password = customers.password;
  this.created_at = customers.created_at;
  this.updated_at = customers.updated_at;

};

Customers.findByPhoneAndRole = (phone, id_role, callback) => {
  const sqlString = "SELECT * FROM customers WHERE phone = ? AND id_role = ?";
  db.query(sqlString, [phone, id_role], (err, result) => {
      if (err) return callback(err);
      callback(null, result[0]);
  });
};

Customers.getById = (id, callback) => {
  const sqlString = "SELECT * FROM customers WHERE id_customer = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Customers.getAll = (callback) => {
  const sqlString = "SELECT * FROM customers";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Customers.insert = (customers, callBack) => {
  const sqlString = "INSERT INTO customers SET ?";
  db.query(sqlString, customers, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...customers });
  });
};

Customers.update = (customers, id, callBack) => {
  const sqlString = "UPDATE customers SET ? WHERE id_customer = ?";
  db.query(sqlString, [customers, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Customers có id = + id + thành công`);
  });
};

Customers.delete = (id, callBack) => {
  db.query(`DELETE FROM customers WHERE id_customer = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Customers có id = + id + thành công`);
  });
};

module.exports = Customers;
