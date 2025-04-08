
const db = require("../common/db");

const Sale_invoices = (sale_invoices) => {
  this.id_sale_invoice = sale_invoices.id_sale_invoice;
  this.id_user = sale_invoices.id_user;
  this.desc = sale_invoices.desc;
  this.total = sale_invoices.total;
  this.pay = sale_invoices.pay;
  this.status = sale_invoices.status;
  this.created_at = sale_invoices.created_at;
  this.updated_at = sale_invoices.updated_at;

};
Sale_invoices.getData = (col, querydata, callback) => {
  const sqlString = `SELECT * FROM Sale_invoices WHERE ?? = ? ORDER BY id_sale_invoice DESC`;
  db.query(sqlString, [col, querydata], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Sale_invoices.getById = (id, callback) => {
  const sqlString = "SELECT * FROM sale_invoices WHERE id_sale_invoice = ? ORDER BY id_sale_invoice DESC";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Sale_invoices.getAll = (callback) => {
  const sqlString = "SELECT * FROM sale_invoices ORDER BY id_sale_invoice DESC";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Sale_invoices.insert = (sale_invoices, callBack) => {
  const sqlString = "INSERT INTO sale_invoices SET ?";
  db.query(sqlString, sale_invoices, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...sale_invoices });
  });
};

Sale_invoices.update = (sale_invoices, id, callBack) => {
  const sqlString = "UPDATE sale_invoices SET ? WHERE id_sale_invoice = ?";
  db.query(sqlString, [sale_invoices, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Sale_invoices có id = + id + thành công`);
  });
};

Sale_invoices.delete = (id, callBack) => {
  db.query(`CALL DeleteSaleInvoice(?)`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Sale_invoices có id = + id + thành công`);
  });
};

module.exports = Sale_invoices;
