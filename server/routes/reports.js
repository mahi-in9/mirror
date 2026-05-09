const router = require('express').Router();
const { getReport } = require('../controllers/reportsController');

router.get('/:shareCode', getReport);

module.exports = router;
