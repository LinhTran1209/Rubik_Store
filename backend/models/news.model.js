
const db = require("../common/db");

const News = (news) => {
  this.id_new = news.id_new;
  this.title = news.title;
  this.desc = news.desc;
  this.image_url = news.image_url;
  this.href = news.href;
  this.created_at = news.created_at;
  this.updated_at = news.updated_at;

};

News.getById = (id, callback) => {
  const sqlString = "SELECT * FROM News WHERE id_new = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

News.getAll = (callback) => {
  const sqlString = "SELECT * FROM News";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

News.insert = (user, callBack) => {
  const sqlString = "INSERT INTO News SET ?";
  db.query(sqlString, user, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...user });
  });
};

News.update = (user, id, callBack) => {
  const sqlString = "UPDATE News SET ? WHERE id_new = ?";
  db.query(sqlString, [user, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật News có id = + id + thành công`);
  });
};

News.delete = (id, callBack) => {
  db.query(`DELETE FROM News WHERE id_new = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa News có id = + id + thành công`);
  });
};

module.exports = News;
