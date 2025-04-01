
var express = require('express');
var router = express.Router();
const products_controller = require("../controllers/products.controller");

/* Routes for products */
router.get('/', products_controller.getAll);
router.get('/:id', products_controller.getById);
router.get('/getData/:col/:querydata', products_controller.getData)

router.post('/', products_controller.insert);
router.put('/:id', products_controller.update);
router.delete('/:id', products_controller.delete);

module.exports = router;
