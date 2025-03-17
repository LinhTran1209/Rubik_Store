
const db = require("../common/db");

const Buy_invoice_details = (buy_invoice_details) => {
  this.id_buy_invoice = buy_invoice_details.id_buy_invoice;
  this.id_product = buy_invoice_details.id_product;
  this.quantity = buy_invoice_details.quantity;
  this.price = buy_invoice_details.price;
  this.created_at = buy_invoice_details.created_at;
  this.updated_at = buy_invoice_details.updated_at;

};


Buy_invoice_details.getById = (id_buy_invoice, id_product, callback) => {
  const sqlString = "SELECT * FROM buy_invoice_details WHERE id_buy_invoice = ? AND id_product = ?";
  db.query(sqlString, [id_buy_invoice, id_product], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0] || null); // Chỉ trả về bản ghi đầu tiên hoặc null
  });
};

Buy_invoice_details.getAllId = (id_buy_invoice, callback) => {
  const sqlString = "SELECT * FROM buy_invoice_details WHERE id_buy_invoice =?";
  db.query(sqlString, [id_buy_invoice], (err, result) => {
    if (err) return callback(err);
    callback(null, result); // Chỉ trả về bản ghi đầu tiên hoặc null
  });
};


Buy_invoice_details.getAll = (callback) => {
  const sqlString = "SELECT * FROM buy_invoice_details";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


Buy_invoice_details.insert = (buy_invoice_details, callback) => {
  const sqlString = "INSERT INTO buy_invoice_details SET ?";
  db.query(sqlString, buy_invoice_details, (err, res) => {
    if (err) return callback(err);
    callback(null, buy_invoice_details); // Trả về object vừa thêm
  });
};


Buy_invoice_details.update = (data, id_buy_invoice, id_product, callback) => {
  const sqlString = "UPDATE buy_invoice_details SET ? WHERE id_buy_invoice = ? AND id_product = ?";
  db.query(sqlString, [data, id_buy_invoice, id_product], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật Buy_invoice_details có id_buy_invoice = ${id_buy_invoice} và id_product = ${id_product} thành công`);
  });
};



Buy_invoice_details.delete = (id_buy_invoice, id_product, callback) => {
  const sqlString = "DELETE FROM buy_invoice_details WHERE id_buy_invoice = ? AND id_product = ?";
  db.query(sqlString, [id_buy_invoice, id_product], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa Buy_invoice_details có id_buy_invoice = ${id_buy_invoice} và id_product = ${id_product} thành công`);
  });
};

module.exports = Buy_invoice_details;
