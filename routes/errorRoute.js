const express = require('express');
const router = express.Router();

// Intentionally throwing an error to simulate a 500-type error
router.use('/error-trigger', (req, res, next) => {
  throw new Error('Oh no! There was a crash. Maybe try another route?');
});

module.exports = router;
