
const User_addresses = require("../models/user_addresses.model");

module.exports = {
  getAll: (req, res) => {
    User_addresses.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getData: (req, res) => {
      const querydata = req.params.querydata; 
      const col = req.params.col; 
      User_addresses.getData(col, querydata, (err, result) => {
          if (err) {
              return res.status(500).send(err); 
          }
          res.send(result); 
      });
  },

  getById: (req, res) => {
    const id = req.params.id;
    User_addresses.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    User_addresses.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    User_addresses.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    User_addresses.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
