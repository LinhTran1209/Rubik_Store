
const db = require("../common/db");

const Sale_invoice_details = (sale_invoice_details) => {
  this.id_sale_invoice = sale_invoice_details.id_sale_invoice;
  this.id_product = sale_invoice_details.id_product;
  this.quantity = sale_invoice_details.quantity;
  this.price = sale_invoice_details.price;
  this.created_at = sale_invoice_details.created_at;
  this.updated_at = sale_invoice_details.updated_at;

};


Sale_invoice_details.getById = (id_sale_invoice, id_product, callback) => {
  const sqlString = "SELECT * FROM sale_invoice_details WHERE id_sale_invoice = ? AND id_product = ?";
  db.query(sqlString, [id_sale_invoice, id_product], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0] || null); // Trả về bản ghi đầu tiên hoặc null
  });
};

Sale_invoice_details.getAllId = (id_sale_invoice, callback) => {
  const sqlString = "SELECT * FROM sale_invoice_details WHERE id_sale_invoice =?";
  db.query(sqlString, [id_sale_invoice], (err, result) => {
    if (err) return callback(err);
    callback(null, result); // Chỉ trả về bản ghi đầu tiên hoặc null
  });
};

Sale_invoice_details.getAll = (callback) => {
  const sqlString = "SELECT * FROM sale_invoice_details";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


Sale_invoice_details.insert = (sale_invoice_details, callback) => {
  const sqlString = "INSERT INTO sale_invoice_details SET ?";
  db.query(sqlString, sale_invoice_details, (err, res) => {
    if (err) return callback(err);
    callback(null, sale_invoice_details); // Trả về object vừa thêm
  });
};

Sale_invoice_details.update = (sale_invoice_details, id_sale_invoice, id_product, callback) => {
  const sqlString = "UPDATE sale_invoice_details SET ? WHERE id_sale_invoice = ? AND id_product = ?";
  db.query(sqlString, [sale_invoice_details, id_sale_invoice, id_product], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật Sale_invoice_details có id_sale_invoice = ${id_sale_invoice} và id_product = ${id_product} thành công`);
  });
};

Sale_invoice_details.delete = (id_sale_invoice, id_product, callback) => {
  const sqlString = "DELETE FROM sale_invoice_details WHERE id_sale_invoice = ? AND id_product = ?";
  db.query(sqlString, [id_sale_invoice, id_product], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa Sale_invoice_details có id_sale_invoice = ${id_sale_invoice} và id_product = ${id_product} thành công`);
  });
};

module.exports = Sale_invoice_details;
