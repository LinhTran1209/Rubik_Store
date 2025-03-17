
var express = require('express');
var router = express.Router();
const buy_invoice_detailscontroller = require("../controllers/buy_invoice_details.controller");

/* Routes for buy_invoice_details */
router.get('/', buy_invoice_detailscontroller.getAll);
router.get('/:id', buy_invoice_detailscontroller.getAllId)
router.get('/:id1/:id2', buy_invoice_detailscontroller.getById);
router.post('/', buy_invoice_detailscontroller.insert);
router.put('/:id1/:id2', buy_invoice_detailscontroller.update);
router.delete('/:id1/:id2', buy_invoice_detailscontroller.delete);

module.exports = router;
