
const Product_images = require("../models/product_images.model");

module.exports = {

  getAll: (req, res) => {
    Product_images.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getByIdProduct: (req, res) => {
    const id = req.params.id;
    Product_images.getByIdProduct(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Product_images.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Product_images.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Product_images.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },



  setMainImage: (req, res) => {
    const { id_image, id_product, image_url, is_main } = req.body;
    Product_images.setMainImage(id_image, id_product, image_url, is_main, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: result });
    });
  },

  deleteImage: (req, res) => {
    const { id_image, id_product } = req.body;
    Product_images.deleteImage(id_image, id_product, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: result });
    });
  },
};
