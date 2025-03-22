
const Categories = require("../models/categories.model");

module.exports = {
  // Lấy id sản phẩm theo tên 
  getData: (req, res) => {
    const querydata = req.params.querydata; 
    const col = req.params.col; 
    Categories.getData(col, querydata, (err, result) => {
        if (err) {
            return res.status(500).send(err); 
        }
        res.send(result); 
    });
},


  getAll: (req, res) => {
    Categories.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Categories.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Categories.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Categories.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Categories.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
