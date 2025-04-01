
const Product_variants = require("../models/product_variants.model");

module.exports = {

    // Lấy id sản phẩm theo tên 
  getData: (req, res) => {
      const querydata = req.params.querydata; 
      const col = req.params.col; 
      Product_variants.getData(col, querydata, (err, result) => {
          if (err) {
              return res.status(500).send(err); 
          }
          res.send(result); 
      });
  },

  getAll: (req, res) => {
    Product_variants.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Product_variants.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Product_variants.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Product_variants.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Product_variants.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
