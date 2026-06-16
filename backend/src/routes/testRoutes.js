const express = require('express');
const { getTestConnection } = require('../controllers/testController');

const router = express.Router();

router.get('/ping', getTestConnection);

module.exports = router;
