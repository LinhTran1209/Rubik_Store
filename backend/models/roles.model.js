
const db = require("../common/db");

const Roles = (roles) => {
  this.id_role = roles.id_role;
  this.name = roles.name;
  this.desc = roles.desc;

};

Roles.getById = (id, callback) => {
  const sqlString = "SELECT * FROM roles WHERE id_role = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Roles.getAll = (callback) => {
  const sqlString = "SELECT * FROM roles";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Roles.insert = (roles, callBack) => {
  const sqlString = "INSERT INTO roles SET ?";
  db.query(sqlString, roles, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...roles });
  });
};

Roles.update = (roles, id, callBack) => {
  const sqlString = "UPDATE roles SET ? WHERE id_role = ?";
  db.query(sqlString, [roles, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Roles có id = + id + thành công`);
  });
};

Roles.delete = (id, callBack) => {
  db.query(`DELETE FROM roles WHERE id_role = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Roles có id = + id + thành công`);
  });
};

module.exports = Roles;
