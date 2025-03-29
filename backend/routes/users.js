
var express = require('express');
var router = express.Router();
const userscontroller = require("../controllers/users.controller");


/* Routes for users */
router.get('/', userscontroller.getAll);
router.get('/:id', userscontroller.getById);
router.post('/', userscontroller.insert);
router.put('/:id', userscontroller.update);
router.delete('/:id', userscontroller.delete);

router.get('/getData/:col/:querydata', userscontroller.getData)

module.exports = router;
