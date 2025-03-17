
const Categories = require("../models/categories.model");

module.exports = {
  // Lấy id sản phẩm theo tên 
  getIdbyName: (req, res) => {
    const name = req.params.name; // Lấy tên từ tham số URL
    Categories.getIdbyName(name, (err, result) => {
        if (err) {
            return res.status(500).send(err); // Trả về lỗi 500 nếu có lỗi
        }
        if (result.length === 0) {
            return res.status(404).send('Category not found'); // Trả về lỗi 404 nếu không tìm thấy
        }
        res.send(result); // Gửi kết quả (ID) về client
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
