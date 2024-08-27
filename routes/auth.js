const express = require('express');
const router = express.Router();

const { authorize, register } = require('../controllers/auth');

router.route('/login').post(authorize);

router.route('/register').post(register);

module.exports = router;
