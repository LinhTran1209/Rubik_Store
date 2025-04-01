
var express = require('express');
var router = express.Router();
const newscontroller = require("../controllers/news.controller");

router.get('/', newscontroller.getAll);
router.get('/:id', newscontroller.getById);
router.post('/', newscontroller.insert);
router.put('/:id', newscontroller.update);
router.delete('/:id', newscontroller.delete);

module.exports = router;
