const db = require("../common/db");

exports.findByPhone = (phone, callback) => {
    const sqlString = `
        SELECT *, 'employee' AS userType FROM Employees WHERE phone = ?
        UNION
        SELECT *, 'customer' AS userType FROM Customers WHERE phone = ?
    `;
    db.query(sqlString, [phone, phone], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
    });
};