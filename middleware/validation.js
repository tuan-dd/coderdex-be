const jwt = require('jsonwebtoken');
const validation = (schema) => async (req, res, next) => {
   let body = req.body;
   let query = req.query;
   try {
      if (body) req.body = await schema.validate(body);
      if (query) req.query = await schema.validate(query);
      // console.log(query);
      next();
   } catch (error) {
      error.statusCode = 400;
      next(error);
   }
};

const validationUpdate = (req, res, next) => {
   const authorizationHeader = req.headers['authorization'];
   const token = authorizationHeader?.split(' ')[1];
   try {
      if (!token) {
         const exception = new Error('Bad Request');
         exception.statusCode = 400;
         throw exception;
      }
      jwt.verify(token, process.env.BACKEND_USER_SECRET_KEY, (err, data) => {
         if (err) {
            err.message = 'Invalid access';
            err.statusCode = 498;
            throw err;
         }
         console.log(data);
         req.user = {
            id: data.id,
            admin: data.admin,
         };
         next();
      });
   } catch (error) {
      next(error);
   }
};
module.exports = { validation, validationUpdate };
// const validationLogin = (schema) => async (req, res, next) => {
//    const body = req.body;
//    try {
//       await schema.validate(body);
//       next();
//    } catch (error) {
//       error.statusCode = 400;
//       next(error);
//    }
// };
