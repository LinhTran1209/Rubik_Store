
var express = require('express');
var router = express.Router();
const sale_invoices_controller = require("../controllers/sale_invoices.controller");

/* Routes for sale_invoices */
router.get('/', sale_invoices_controller.getAll);
router.get('/:id', sale_invoices_controller.getById);
router.post('/', sale_invoices_controller.insert);
router.put('/:id', sale_invoices_controller.update);
router.delete('/:id', sale_invoices_controller.delete);
router.get('/getData/:col/:querydata', sale_invoices_controller.getData)

module.exports = router;
