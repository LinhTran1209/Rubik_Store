
var express = require('express');
var router = express.Router();
const rolescontroller = require("../controllers/roles.controller");

/* Routes for roles */
router.get('/', rolescontroller.getAll);
router.get('/:id', rolescontroller.getById);
router.post('/', rolescontroller.insert);
router.put('/:id', rolescontroller.update);
router.delete('/:id', rolescontroller.delete);

module.exports = router;
