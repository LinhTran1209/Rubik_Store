
const Buy_invoice_details = require("../models/buy_invoice_details.model");

module.exports = {
  getAll: (req, res) => {
    Buy_invoice_details.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id_buy_invoice = parseInt(req.params.id1); // Lấy id1 từ route
    const id_product = parseInt(req.params.id2);     // Lấy id2 từ route
  
    // Kiểm tra dữ liệu đầu vào
    if (isNaN(id_buy_invoice) || isNaN(id_product)) {
      return res.status(400).send({ error: 'ID phải là số hợp lệ' });
    }
  
    Buy_invoice_details.getById(id_buy_invoice, id_product, (err, result) => {
      if (err) return res.status(500).send({ error: 'Lỗi server', details: err });
      if (!result) return res.status(404).send({ error: 'Không tìm thấy bản ghi' });
      res.send(result);
    });
  },

  getAllId: (req, res) => {
    const id = req.params.id;
    Buy_invoice_details.getAllId(id, (err, result) => {
      if (err) return res.status(500).send({ error: 'Lỗi server', details: err});
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Buy_invoice_details.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id_buy_invoice = parseInt(req.params.id1); // Lấy id1 từ route
    const id_product = parseInt(req.params.id2);     // Lấy id2 từ route

    // Kiểm tra dữ liệu đầu vào
    if (isNaN(id_buy_invoice) || isNaN(id_product)) {
      return res.status(400).send({ error: 'ID phải là số hợp lệ' });
    }

    Buy_invoice_details.update(data, id_buy_invoice, id_product, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id_buy_invoice = parseInt(req.params.id1); // Lấy id1 từ route
    const id_product = parseInt(req.params.id2);     // Lấy id2 từ route

    // Kiểm tra dữ liệu đầu vào
    if (isNaN(id_buy_invoice) || isNaN(id_product)) {
      return res.status(400).send({ error: 'ID phải là số hợp lệ' });
    }

    Buy_invoice_details.delete(id_buy_invoice, id_product, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
