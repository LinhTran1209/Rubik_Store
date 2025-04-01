
var express = require('express');
var router = express.Router();
const productImage_controller = require("../controllers/product_images.controller");

/* Routes for products */
router.get('/', productImage_controller.getAll);
router.get('/:id', productImage_controller.getByIdProduct);
router.post('/', productImage_controller.insert);
router.put('/:id', productImage_controller.update);
router.delete('/:id', productImage_controller.delete);

router.post('/set-main-image', productImage_controller.setMainImage);
router.post('/delete-image', productImage_controller.deleteImage);

module.exports = router;
