
var express = require('express');
var router = express.Router();
const productImage = require("../controllers/product_images.controller");

/* Routes for products */
router.get('/', productImage.getAll);
router.get('/:id', productImage.getByIdProduct);
router.post('/', productImage.insert);
router.put('/:id', productImage.update);
router.delete('/:id', productImage.delete);

module.exports = router;
