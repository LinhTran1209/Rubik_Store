
const db = require("../common/db");

const Buy_invoices = (buy_invoices) => {
  this.id_buy_invoice = buy_invoices.id_buy_invoice;
  this.id_supplier = buy_invoices.id_supplier;
  this.id_employee = buy_invoices.id_employee;
  this.desc = buy_invoices.desc;
  this.total = buy_invoices.total;
  this.status = buy_invoices.status;
  this.created_at = buy_invoices.created_at;
  this.updated_at = buy_invoices.updated_at;

};

Buy_invoices.getById = (id, callback) => {
  const sqlString = "SELECT * FROM buy_invoices WHERE id_buy_invoice = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Buy_invoices.getAll = (callback) => {
  const sqlString = "SELECT * FROM buy_invoices";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Buy_invoices.insert = (buy_invoices, callBack) => {
  const sqlString = "INSERT INTO buy_invoices SET ?";
  db.query(sqlString, buy_invoices, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...buy_invoices });
  });
};

Buy_invoices.update = (buy_invoices, id, callBack) => {
  const sqlString = "UPDATE buy_invoices SET ? WHERE id_buy_invoice = ?";
  db.query(sqlString, [buy_invoices, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Buy_invoices có id = + id + thành công`);
  });
};

Buy_invoices.delete = (id, callBack) => {
  db.query(`DELETE FROM buy_invoices WHERE id_buy_invoice = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Buy_invoices có id = + id + thành công`);
  });
};

module.exports = Buy_invoices;
