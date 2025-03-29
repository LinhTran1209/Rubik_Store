
const Carts = require("../models/carts.model");

module.exports = {
  getAll: (req, res) => {
    Carts.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Carts.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Carts.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id_user = req.params.id_user;
    const id_product = req.params.id_product;
    Carts.update(data, id_user, id_product, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id_user = req.params.id_user;
    const id_product = req.params.id_product;
    Carts.delete(id_user, id_product,(err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
