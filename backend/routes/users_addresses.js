
var express = require('express');
var router = express.Router();
const user_address_controller = require("../controllers/user_addresses.controller");


/* Routes for users */
router.get('/', user_address_controller.getAll);
router.get('/:id', user_address_controller.getById);
router.post('/', user_address_controller.insert);
router.put('/:id', user_address_controller.update);
router.delete('/:id', user_address_controller.delete);

router.get('/getData/:col/:querydata', user_address_controller.getData)

module.exports = router;
