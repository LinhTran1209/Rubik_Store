
var express = require('express');
var router = express.Router();
const categoriescontroller = require("../controllers/categories.controller");
const authenticateToken = require('../authMiddleware');

/* Routes for categories */
router.get('/', authenticateToken, categoriescontroller.getAll);
router.get('/:id', categoriescontroller.getById);
router.get('/getData/:col/:querydata', categoriescontroller.getData)
    


router.post('/', categoriescontroller.insert);
router.put('/:id', categoriescontroller.update);
router.delete('/:id', categoriescontroller.delete);

module.exports = router;
