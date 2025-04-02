
var express = require('express');
var router = express.Router();
// const authenticateToken = require('../authMiddleware');
const sale_invoice_details_controller = require("../controllers/sale_invoice_details.controller");

/* Routes for sale_invoice_details */
router.get('/', sale_invoice_details_controller.getAll);
router.get('/:id', sale_invoice_details_controller.getAllId)
router.get('/:id1/:id2', sale_invoice_details_controller.getById);
router.post('/', sale_invoice_details_controller.insert);
router.put('/:id1/:id2', sale_invoice_details_controller.update);
router.delete('/:id1/:id2', sale_invoice_details_controller.delete);
router.get('/getData/:col/:querydata', sale_invoice_details_controller.getData)

module.exports = router;
