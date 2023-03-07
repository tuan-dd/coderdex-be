const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');

const db = JSON.parse(fs.readFileSync('users.json'));
const users = db.users;
const login = async (req, res, next) => {
   const { email, password } = req.body;
   try {
      // console.log(db);
      const user = users?.find((e) => e.email === email);
      if (!user) {
         const exception = new Error('user not exits');
         exception.statusCode = 404;
         throw exception;
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
         const exception = new Error('wrong password ');
         exception.statusCode = 404;
         throw exception;
      }
      const accessToken = jwt.sign(
         { id: user.id, admin: user.admin },
         process.env.BACKEND_USER_SECRET_KEY,
         { expiresIn: '24h' },
      );
      const refreshToken = jwt.sign(
         { id: user.id },
         process.env.BACKEND_USER_REFRESH_KEY,
      );
      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: false,
         path: '/',
         sameSite: 'strict',
      });
      res.status(200).json({ accessToken });
   } catch (error) {
      next(error);
   }
};
/// check exit
const register = async (req, res, next) => {
   const { email, password, name } = req.body;
   try {
      const user = users?.find((e) => e.email === email);
      if (user) {
         const exception = new Error('user exits');
         exception.statusCode = 404;
         throw exception;
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const newUser = {
         id: Math.random().toString(36).substring(2, 12).toLocaleUpperCase(),
         name,
         email,
         password: hashed,
         admin: false,
         pokemon: [],
      };
      db.users.push(newUser);
      db.count = db.users.length;
      fs.writeFile('users.json', JSON.stringify(db), (err, data) => {
         if (err) {
            err.message = 'server maintenance . Sorry for the inconvenience ';
            err.statusCode = 503;
            throw err;
         }
         oke();
      });
      function oke() {
         return res.status(200).send('Successful Registration');
      }
   } catch (error) {
      next(error);
   }
};
// check exit, check pw
const update = async (req, res, next) => {
   //  console.log(id);
   const body = req.body;
   const updateUser = { ...body };
   delete updateUser.password;
   delete updateUser.newPassword;
   try {
      const indexUser = users?.findIndex((e) => e.email === body.email);
      if (indexUser < 0) {
         const exception = new Error('user exits');
         exception.statusCode = 404;
         throw exception;
      }
      const user = users[indexUser];
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (!validPassword) {
         const exception = new Error('wrong password ');
         exception.statusCode = 404;
         throw exception;
      }
      if (body.newPassword) {
         const salt = await bcrypt.genSalt(10);
         const hashed = await bcrypt.hash(body.newPassword, salt);
         user.password = hashed;
      }
      for (let key in updateUser) {
         if (updateUser[key]) {
            user[key] = updateUser[key];
         }
      }
      db.users[indexUser] = user;
      fs.writeFile('users.json', JSON.stringify(db), (err, data) => {
         if (err) {
            err.message = 'server maintenance . Sorry for the inconvenience ';
            err.statusCode = 503;
            throw err;
         }
         oke();
      });
      function oke() {
         return res.status(200).send('Update successful');
      }
   } catch (error) {
      next(error);
   }
};

module.exports = { login, register, update };
