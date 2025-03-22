
const Products = require("../models/products.model");

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
    Products.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Products.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Products.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Products.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Products.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
