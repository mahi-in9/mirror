const router = require('express').Router();
const { getUserByUsername, getUserByShareCode } = require('../controllers/usersController');

router.get('/:username', getUserByUsername);
router.get('/share/:shareCode', getUserByShareCode);

module.exports = router;
