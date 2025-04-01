
var express = require('express');
var router = express.Router();
const product_variants_controller = require("../controllers/product_variants.controller");

router.get('/', product_variants_controller.getAll);
router.get('/:id', product_variants_controller.getById);
router.get('/getData/:col/:querydata', product_variants_controller.getData)

router.post('/', product_variants_controller.insert);
router.put('/:id', product_variants_controller.update);
router.delete('/:id', product_variants_controller.delete);

module.exports = router;
