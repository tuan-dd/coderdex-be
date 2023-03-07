const express = require('express');
const router = express.Router();
const pokemonRouter = require('./pokemon');
const authRouter = require('./auth');
/* GET home page. */
router.get('/', function (req, res, next) {
   res.status(200).send('Pokemon Go');
});
router.use('/pokemon', pokemonRouter);
router.use('/user', authRouter);

module.exports = router;
