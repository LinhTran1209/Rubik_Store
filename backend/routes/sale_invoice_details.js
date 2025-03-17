
var express = require('express');
var router = express.Router();
const sale_invoice_detailscontroller = require("../controllers/sale_invoice_details.controller");

/* Routes for sale_invoice_details */
router.get('/', sale_invoice_detailscontroller.getAll);
router.get('/:id', sale_invoice_detailscontroller.getAllId)
router.get('/:id1/:id2', sale_invoice_detailscontroller.getById);
router.post('/', sale_invoice_detailscontroller.insert);
router.put('/:id1/:id2', sale_invoice_detailscontroller.update);
router.delete('/:id1/:id2', sale_invoice_detailscontroller.delete);

module.exports = router;
