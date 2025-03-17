
var express = require('express');
var router = express.Router();
const employeescontroller = require("../controllers/employees.controller");

/* Routes for employees */
router.get('/', employeescontroller.getAll);
router.get('/:id', employeescontroller.getById);
router.post('/', employeescontroller.insert);
router.put('/:id', employeescontroller.update);
router.delete('/:id', employeescontroller.delete);

module.exports = router;
