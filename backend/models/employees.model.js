
const db = require("../common/db");

const Employees = (employees) => {
  this.id_employee = employees.id_employee;
  this.id_role = employees.id_role;
  this.name = employees.name;
  this.email = employees.email;
  this.phone = employees.phone;
  this.address = employees.address;
  this.status = employees.status;
  this.created_at = employees.created_at;
  this.updated_at = employees.updated_at;

};

Employees.getById = (id, callback) => {
  const sqlString = "SELECT * FROM employees WHERE id_employee = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Employees.getAll = (callback) => {
  const sqlString = "SELECT * FROM employees";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Employees.insert = (employees, callBack) => {
  const sqlString = "INSERT INTO employees SET ?";
  db.query(sqlString, employees, (err, res) => {
    console.log(employees)
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...employees });
  });
};

Employees.update = (employees, id, callBack) => {
  const sqlString = "UPDATE employees SET ? WHERE id_employee = ?";
  db.query(sqlString, [employees, id], (err, res) => {
    if (err) return callBack(err);
    console.log(sqlString)
    console.log([employees, id])
    callBack(null, `Cập nhật Employees có id = + id + thành công`);
  });
};

Employees.delete = (id, callBack) => {
  db.query(`DELETE FROM employees WHERE id_employee = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Employees có id = + id + thành công`);
  });
};

module.exports = Employees;
