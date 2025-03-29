
const db = require("../common/db");
const createSlug = require("../utils/createSlug");

const Products = (products) => {
  this.id_product = products.id_product;
  this.id_categorie = products.id_categorie;
  this.name = products.name;
  this.image_url = products.image_url;
  this.quantity = products.quantity;
  this.price = products.price;
  this.desc = products.desc;
  this.status = products.status;
  this.slug = products.slug;
  this.created_at = products.created_at;
  this.updated_at = products.updated_at;

};

// Tìm kiếm mọi col sản phẩm theo querydata và trả về object
Products.getData = (col, querydata, callback) => {
  const sqlString = `SELECT * FROM products WHERE ?? = ?`;
  db.query(sqlString, [col, querydata], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Products.getById = (id, callback) => {
  const sqlString = "SELECT * FROM products WHERE id_product = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};

Products.getAll = (callback) => {
  const sqlString = "SELECT * FROM products ORDER BY id_product DESC";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Products.insert = (products, callBack) => {
  const sqlString = "INSERT INTO products SET ?";
  products.slug = createSlug(products.name);
  db.query(sqlString, products, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...products });
  });
};

Products.update = (products, id, callBack) => {
  const sqlString = "UPDATE products SET ? WHERE id_product = ?";
  products.slug = createSlug(products.name);
  db.query(sqlString, [products, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Products có id = + id + thành công`);
  });
};

Products.delete = (id, callBack) => {
  db.query(`DELETE FROM products WHERE id_product = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Products có id = + id + thành công`);
  });
};

module.exports = Products;
