
const Sale_invoice_details = require("../models/sale_invoice_details.model");

module.exports = {
  getData: (req, res) => {
      const querydata = req.params.querydata; 
      const col = req.params.col; 
      Sale_invoice_details.getData(col, querydata, (err, result) => {
          if (err) {
              return res.status(500).send(err); 
          }
          res.send(result); 
      });
  },
  getAll: (req, res) => {
    Sale_invoice_details.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id_sale_invoice = parseInt(req.params.id1); // Lấy id1 từ route
    const id_variant = parseInt(req.params.id2);     // Lấy id2 từ route
  
    // Kiểm tra dữ liệu đầu vào
    if (isNaN(id_sale_invoice) || isNaN(id_variant)) {
      return res.status(400).send({ error: 'ID phải là số hợp lệ' });
    }
    Sale_invoice_details.getById(id_sale_invoice, id_variant, (err, result) => {
      if (err) return res.status(500).send({ error: 'Lỗi server', details: err });
      if (!result) return res.status(404).send({ error: 'Không tìm thấy bản ghi' });
      res.send(result);
    });
  },

  getAllId: (req, res) => {
    const id = req.params.id;
    Sale_invoice_details.getAllId(id, (err, result) => {
      if (err) return res.status(500).send({ error: 'Lỗi server', details: err});
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Sale_invoice_details.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id_sale_invoice = parseInt(req.params.id1); // Lấy id1 từ route
    const id_variant = parseInt(req.params.id2);     // Lấy id2 từ route
  
    // Kiểm tra dữ liệu đầu vào
    if (isNaN(id_sale_invoice) || isNaN(id_variant)) {
      return res.status(400).send({ error: 'ID phải là số hợp lệ' });
    }
    Sale_invoice_details.update(data, id_sale_invoice, id_variant, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id_sale_invoice = parseInt(req.params.id1); // Lấy id1 từ route
    const id_variant = parseInt(req.params.id2);     // Lấy id2 từ route
  
    // Kiểm tra dữ liệu đầu vào
    if (isNaN(id_sale_invoice) || isNaN(id_variant)) {
      return res.status(400).send({ error: 'ID phải là số hợp lệ' });
    }

    Sale_invoice_details.delete(id_sale_invoice, id_variant, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
