
const db = require("../common/db");
const createSlug = require("../utils/createSlug");

const Categories = (categories) => {
  this.id_categorie = categories.id_categorie;
  this.name = categories.name;
  this.desc = categories.desc;
  this.status = categories.status;
  this.slug = categories.slug;
  this.created_at = categories.created_at;
  this.updated_at = categories.updated_at;

};

// Tìm kiếm tên loại sản phẩm theo querydata và trả về object
Categories.getData = (col, querydata, callback) => {
  const sqlString = `SELECT * FROM categories WHERE ?? = ?`;
  db.query(sqlString, [col, querydata], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Categories.getById = (id, callback) => {
  const sqlString = "SELECT * FROM categories WHERE id_categorie = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Categories.getAll = (callback) => {
  const sqlString = "SELECT * FROM categories";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Categories.insert = (categories, callBack) => {
  const sqlString = "INSERT INTO categories SET ?";
  // tạo slug cho categories
  categories.slug = createSlug(categories.name);
  db.query(sqlString, categories, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...categories });
  });
};

Categories.update = (categories, id, callBack) => {
  const sqlString = "UPDATE categories SET ? WHERE id_categorie = ?";
  // Cập nhật lại slug
  categories.slug = createSlug(categories.name);
  db.query(sqlString, [categories, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Categories có id = + id + thành công`);
  });
};

Categories.delete = (id, callBack) => {
  db.query(`DELETE FROM categories WHERE id_categorie = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Categories có id = + id + thành công`);
  });
};




module.exports = Categories;
