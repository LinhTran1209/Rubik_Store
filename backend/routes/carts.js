
var express = require('express');
var router = express.Router();
const cartscontroller = require("../controllers/carts.controller");

/* Routes for carts */
router.get('/', cartscontroller.getAll);
router.get('/:id', cartscontroller.getById);
router.post('/', cartscontroller.insert);
router.put('/:id_user/:id_product', cartscontroller.update);
router.delete('/:id_user/:id_product', cartscontroller.delete);

module.exports = router;
