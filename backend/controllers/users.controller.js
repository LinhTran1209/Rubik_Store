
const Users = require("../models/users.model");

module.exports = {

    // Lấy id sản phẩm theo tên 
  getData: (req, res) => {
      const querydata = req.params.querydata; 
      const col = req.params.col; 
      Users.getData(col, querydata, (err, result) => {
          if (err) {
              return res.status(500).send(err); 
          }
          res.send(result); 
      });
  },
  getAll: (req, res) => {
    // Kiểm tra quyền
    // if (req.user.type !== 'employee' || req.user.role !== 1) {
    //   return res.status(403).send('Chỉ admin mới có quyền truy cập!');
    // }
    Users.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Users.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Users.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Users.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Users.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
