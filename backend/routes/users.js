
var express = require('express');
var router = express.Router();
const users_controller = require("../controllers/users.controller");


/* Routes for users */
router.get('/', users_controller.getAll);
router.get('/:id', users_controller.getById);
router.post('/', users_controller.insert);
router.put('/:id', users_controller.update);
router.delete('/:id', users_controller.delete);

router.get('/getData/:col/:querydata', users_controller.getData)

module.exports = router;
