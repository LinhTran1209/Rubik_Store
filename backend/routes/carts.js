
var express = require('express');
var router = express.Router();
const carts_controller = require("../controllers/carts.controller");

/* Routes for carts */
router.get('/', carts_controller.getAll);
router.get('/:id', carts_controller.getById);
router.post('/', carts_controller.insert);
router.put('/:id_user/:id_variant', carts_controller.update);
router.delete('/:id_user/:id_variant', carts_controller.delete);

module.exports = router;
