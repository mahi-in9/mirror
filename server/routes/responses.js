const router = require('express').Router();
const { submitResponse } = require('../controllers/responsesController');

router.post('/:shareCode', submitResponse);

module.exports = router;
