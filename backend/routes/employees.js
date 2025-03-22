
var express = require('express');
var router = express.Router();
const employeescontroller = require("../controllers/employees.controller");
const authenticateToken = require('../authMiddleware');
const bcrypt = require('bcrypt');


/* Routes for employees */
router.get('/', authenticateToken, employeescontroller.getAll);
router.get('/:id', employeescontroller.getById);
router.post('/', employeescontroller.insert);
router.put('/:id', employeescontroller.update);
router.delete('/:id', employeescontroller.delete);

module.exports = router;
