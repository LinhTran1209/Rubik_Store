var express = require('express');
var router = express.Router();
const categories_controller = require("../controllers/categories.controller");

/* Routes for categories */
router.get('/', categories_controller.getAll);
router.get('/:id', categories_controller.getById);
router.get('/getData/:col/:querydata', categories_controller.getData)
    

router.post('/', categories_controller.insert);
router.put('/:id', categories_controller.update);
router.delete('/:id', categories_controller.delete);

module.exports = router;
