
var express = require('express');
var router = express.Router();
const customerscontroller = require("../controllers/customers.controller");

/* Routes for customers */
router.get('/', customerscontroller.getAll);
router.get('/:id', customerscontroller.getById);
router.post('/', customerscontroller.insert);
router.put('/:id', customerscontroller.update);
router.delete('/:id', customerscontroller.delete);

module.exports = router;
