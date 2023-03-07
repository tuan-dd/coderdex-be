const express = require('express');
const router = express();
const authController = require('../controllers/authControllers');
const { validation, validationUpdate } = require('../middleware/validation');
const {
   loginSchema,
   RegisterSchema,
   updateSchema,
} = require('../validations/userValidation');

router.get('/login', validation(loginSchema), authController.login);

router.post('/register', validation(RegisterSchema), authController.register);

router.put(
   '/update',
   validation(updateSchema),
   validationUpdate,
   authController.update,
);

module.exports = router;
