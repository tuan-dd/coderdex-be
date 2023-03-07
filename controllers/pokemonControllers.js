const fs = require('fs');
// const { createPokemonDb } = require('../models/createPokemonDb');

const db = JSON.parse(fs.readFileSync('db.json'));
const dbUser = JSON.parse(fs.readFileSync('users.json'));
const { data, totalPages, count } = db;
const users = dbUser.users;

// query có củng dc k có củng k sao
// q
function error(message, code) {
   const exception = new Error(message);
   exception.statusCode = code;
   throw exception;
}
const getPokemons = async (req, res, next) => {
   const query = req.query;
   const filter = {
      type1: query.type1, //type 1 && type 2
      type2: query.type2,
      type: query.type, // type && (type1, type2 null)
      name: query.name,
      japanese_name: query.japaneseName,
      page: query.page,
   };
   try {
      if (filter.type && (filter.type1 || filter.type2)) {
         error('Bad Request', 400);
      }
      if (filter.type1 && !filter.type2) {
         error('Bad Request', 400);
      } else if (!filter.type1 && filter.type2) {
         error('Bad Request', 400);
      }

      if (filter.page > totalPages) {
         error('Bad Request', 400);
      }
      Object.keys(filter).forEach((key) => {
         if (!filter[key]) delete filter[key];
      });

      const keyValid = Object.keys(filter).slice(
         0,
         Object.keys(filter).length - 1,
      );
      // console.log(filter);
      let result = data.slice(0, 801);
      if (filter.type1 && filter.type2) {
         console.log('run 1');
         result = result.filter((pokemon) => {
            let isValid = false;
            if (
               pokemon.type1 === filter.type1 &&
               pokemon.type2 === filter.type2
            ) {
               isValid = true;
               keyValid.slice(2)?.forEach((e) => {
                  if (!pokemon[e].includes(filter[e])) {
                     isValid = false;
                  }
               });
            }
            return isValid;
         });
      } else if (keyValid.length > 0) {
         console.log('run 2');
         result = result.filter((pokemon) => {
            let isValid = false;
            keyValid.forEach((e) => {
               if (e === 'type') {
                  if (
                     pokemon.type1.includes(filter[e]) ||
                     pokemon.type2.includes(filter[e])
                  )
                     isValid = true;
               } else if (pokemon[e].includes(filter[e])) {
                  isValid = true;
               }
            });
            return isValid;
         });
      }
      console.log(result?.length);
      if (filter.page === 1) {
         result = result.slice(0, 20);
      } else {
         let start = 20 * (filter.page - 1);
         result = result.slice(start, filter.page * 20);
      }
      if (!result.length) return res.status(404).send('Not found pokemon');
      db.data = result;
      res.status(200).json({ result: db });
   } catch (error) {
      next(error);
   }
};

const getPokemonId = async (req, res, next) => {
   const pokemonId = Math.abs(parseInt(req.params.pokeId));
   try {
      if (!pokemonId) {
         error('Bad Request', 400);
      }
      if (pokemonId > data.length) {
         error('Not found pokemon', 404);
      }
      if (data[pokemonId - 1].isDelete) {
         error('Not found pokemon', 404);
      }
      let dataDefault = data.slice(0, 801);
      let result;
      data.forEach((item, i) => {
         if (item.id === pokemonId) {
            result =
               item.id === dataDefault.length
                  ? [dataDefault[i - 1], item, dataDefault[0]]
                  : item.id > 1
                  ? [dataDefault[i - 1], item, dataDefault[i + 1]]
                  : [dataDefault[dataDefault.length - 1], item, data[1]];
         }
      });
      res.status(200).json({ result: result });
   } catch (error) {
      next(error);
   }
};

const createPokemon = async (req, res, next) => {
   const user = req.user;
   const body = req.body;
   try {
      const indexUser = users.findIndex((e) => e.id === user.id);
      if (indexUser < 0) {
         error('not found user', 404);
      }
      const checkPokemon = data.some((e) => e.name === body.name);
      if (checkPokemon) {
         error('The Pokémon already exists', 409);
      }
      const newPokemon = {
         ...body,
         id: data.length + 1,
         isDelete: false,
      };
      data.push(newPokemon);
      const newDbPokemon = {
         count: data.length,
         totalPages: Math.ceil(data.length / 20),
         data: data,
      };
      users[indexUser].pokemon.push(data.length);
      dbUser.users = users;
      fs.writeFile('users.json', JSON.stringify(dbUser), (data, err) => {
         if (err)
            error('server maintenance . Sorry for the inconvenience ', 503);
         fs.writeFile('db.json', JSON.stringify(newDbPokemon), (data, err) => {
            if (err) {
               error('server maintenance . Sorry for the inconvenience ', 503);
            }
            oke();
         });
      });

      function oke() {
         res.status(201).send('Create Successful');
      }
   } catch (error) {
      next(error);
   }
};

const updatePokemon = async (req, res, next) => {
   const pokemonId = Math.abs(parseInt(req.params.pokeId));
   const user = req.user;
   const newUpdatePokemon = req.body;
   try {
      const indexUser = users.findIndex((e) => e.id === user.id);
      if (indexUser < 0) {
         error('Not found user', 404);
      }

      const isPokemonOfUser = users[indexUser].pokemon.some(
         (e) => e === pokemonId,
      );
      if (!isPokemonOfUser) {
         error('It not your pokemon', 403);
      }

      if (!data[pokemonId - 1]) {
         users[indexUser].pokemon.filter((pokeId) => pokeId !== pokemonId);
         error('not found pokemon,you can create new pokemon', 404);
      }
      const keyOfPokemon = Object.keys(newUpdatePokemon);
      const filter = data[0]; /// key of object a pokemon
      // console.log(data[0].length === data[3].length);
      let pokemon = data[pokemonId - 1];
      keyOfPokemon.forEach((key) => {
         const array = ['abilities', 'imgPaths'];
         for (let i in filter) {
            // get all key
            if (key === i) {
               console.log('run');
               if (array.includes(i) && newUpdatePokemon[key]) {
                  pokemon[key] = pokemon[key].concat(newUpdatePokemon[key]);
               } else if (!isNaN(filter[key])) {
                  // check value of property is numbles or string
                  if (!isNaN(newUpdatePokemon[key])) {
                     // property of newUpdatePokemon and  property === numbles
                     pokemon[key] = newUpdatePokemon[key].toString();
                  } else {
                     error('input numbles', 400);
                  }
               } else {
                  pokemon[key] = newUpdatePokemon[key];
               }
            }
         }
      });
      data[pokemonId - 1] = pokemon;
      db.data = data;
      fs.writeFile('db.json', JSON.stringify(db), (data, err) => {
         if (err) {
            error('server maintenance . Sorry for the inconvenience ', 503);
         }
         oke();
      });
      function oke() {
         res.status(204).send('update Successful');
      }
   } catch (error) {
      next(error);
   }
};
const deletePokemon = async (req, res, next) => {
   const pokemonId = Math.abs(parseInt(req.params.pokeId));
   const user = req.user;
   try {
      const indexUser = users.findIndex((e) => e.id === user.id);
      if (indexUser < 0) {
         error('Not found user', 404);
      }
      if (!data[pokemonId - 1] || data[pokemonId - 1].isDelete) {
         users[indexUser].pokemon.filter((pokeId) => pokeId !== pokemonId);
         error('not found pokemon or pokemon is delete', 404);
      }
      const isPokemonOfUser = users[indexUser].pokemon.some(
         (e) => e === pokemonId,
      );
      if (!isPokemonOfUser) {
         error('It not your pokemon', 403);
      }
      db.data[pokemonId - 1].isDelete = true;
      fs.writeFile('db.json', JSON.stringify(db), (data, err) => {
         if (err) {
            error('server maintenance . Sorry for the inconvenience ', 503);
         }
         oke();
      });
      function oke() {
         res.status(204).send('resource updated successfully');
      }
   } catch (error) {
      next(error);
   }
};

module.exports = {
   getPokemons,
   getPokemonId,
   createPokemon,
   deletePokemon,
   updatePokemon,
};
