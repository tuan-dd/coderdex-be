const yup = require('yup');

const RegisterSchema = yup.object({
   name: yup.string().required(),
   email: yup.string().email().required(),
   password: yup.string().min(6).max(12).required(),
});
const loginSchema = yup.object({
   email: yup.string().email().required(),
   password: yup.string().required(),
});

const updateSchema = yup.object({
   id: yup.string().max(0, 'Should not have an ID'),
   admin: yup.string().max(0, 'Should not have an admin'),
   email: yup.string().email().required(),
   password: yup.string().required(),
   newPassword: yup
      .string()
      .notRequired()
      .min(6)
      .max(12)
      .notOneOf(
         [yup.ref('password'), null],
         'New Password must not same old password ',
      ),
});

module.exports = { RegisterSchema, loginSchema, updateSchema };
