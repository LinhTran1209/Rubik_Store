
var express = require('express');
var router = express.Router();
const buy_invoicescontroller = require("../controllers/buy_invoices.controller");

/* Routes for buy_invoices */
router.get('/', buy_invoicescontroller.getAll);
router.get('/:id', buy_invoicescontroller.getById);
router.post('/', buy_invoicescontroller.insert);
router.put('/:id', buy_invoicescontroller.update);
router.delete('/:id', buy_invoicescontroller.delete);

module.exports = router;
