const { getSignUpPage, postSignUp } = require('../controllers/authController');

const router = require('express').Router();

router.get('/auth/sign-up', getSignUpPage);

router.post('/auth/sign-up', postSignUp);

module.exports = router;
