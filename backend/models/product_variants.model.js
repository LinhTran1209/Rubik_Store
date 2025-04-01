
const db = require("../common/db");

const Product_variants = (product_variant) => {
  this.id_variant = product_variant.id_variant;
  this.id_product = product_variant.id_product;
  this.color = product_variant.color;
  this.quantity = product_variant.quantity;
  this.price = product_variant.price;
  this.created_at = product_variant.created_at;
  this.updated_at = product_variant.updated_at;

};

// Tìm kiếm mọi col sản phẩm theo querydata và trả về object
Product_variants.getData = (col, querydata, callback) => {
  const sqlString = `SELECT * FROM Product_variants WHERE ?? = ?`;
  db.query(sqlString, [col, querydata], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Product_variants.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Product_variants WHERE id_variant = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};

Product_variants.getAll = (callback) => {
  const sqlString = "SELECT * FROM Product_variants ORDER BY id_variant DESC";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Product_variants.insert = (product_variant, callBack) => {
  const sqlString = "INSERT INTO Product_variants SET ?";
  db.query(sqlString, product_variant, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...product_variant });
  });
};

Product_variants.update = (product_variant, id, callBack) => {
  const sqlString = "UPDATE Product_variants SET ? WHERE id_variant = ?";
  db.query(sqlString, [product_variant, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Product_variants có id = + id + thành công`);
  });
};

Product_variants.delete = (id, callBack) => {
  db.query(`DELETE FROM Product_variants WHERE id_variant = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Product_variant có id = + id + thành công`);
  });
};

module.exports = Product_variants;
