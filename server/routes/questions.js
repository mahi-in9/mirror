const router = require('express').Router();
const { generateQuestions } = require('../controllers/questionsController');

router.get('/generate', generateQuestions);

module.exports = router;
