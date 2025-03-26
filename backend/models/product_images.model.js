
const db = require("../common/db");

const Product_images = (product_image) => {
  this.id_image = product_image.id_image;
  this.id_product = product_image.id_product;
  this.image_url = product_image.image_url;
  this.is_main = product_image.is_main;
  this.created_at = product_image.created_at;
  this.updated_at = product_image.updated_at;

};

Product_images.getByIdProduct = (id, callback) => {
  const sqlString = "SELECT * FROM Product_images WHERE id_product = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Product_images.getAll = (callback) => {
  const sqlString = "SELECT * FROM Product_images";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Product_images.insert = (Product_images, callBack) => {
  const sqlString = "INSERT INTO Product_images SET ?";
  db.query(sqlString, Product_images, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...Product_images });
  });
};

Product_images.update = (Product_images, id, callBack) => {
  const sqlString = "UPDATE Product_images SET ? WHERE id_image = ?";
  db.query(sqlString, [Product_images, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Product_images có id = + id + thành công`);
  });
};

Product_images.delete = (id, callBack) => {
  db.query(`DELETE FROM Product_images WHERE id_image = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Product_images có id = + id + thành công`);
  });
};

module.exports = Product_images;
