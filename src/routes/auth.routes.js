const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/register', authCtrl.register); // optional for seeding
router.post('/login', authCtrl.login);

module.exports = router;
