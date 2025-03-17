
var express = require('express');
var router = express.Router();
const supplierscontroller = require("../controllers/suppliers.controller");

/* Routes for suppliers */
router.get('/', supplierscontroller.getAll);
router.get('/:id', supplierscontroller.getById);
router.post('/', supplierscontroller.insert);
router.put('/:id', supplierscontroller.update);
router.delete('/:id', supplierscontroller.delete);

module.exports = router;
