const router = require('express').Router();
const { getShareCard } = require('../controllers/shareController');

router.get('/:shareCode', getShareCard);

module.exports = router;
