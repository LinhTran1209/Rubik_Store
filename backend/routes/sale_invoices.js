
var express = require('express');
var router = express.Router();
const sale_invoicescontroller = require("../controllers/sale_invoices.controller");

/* Routes for sale_invoices */
router.get('/', sale_invoicescontroller.getAll);
router.get('/:id', sale_invoicescontroller.getById);
router.post('/', sale_invoicescontroller.insert);
router.put('/:id', sale_invoicescontroller.update);
router.delete('/:id', sale_invoicescontroller.delete);

module.exports = router;
