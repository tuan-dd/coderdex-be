const express = require('express');
const router = express();
const {
   getPokemonId,
   getPokemons,
   deletePokemon,
   createPokemon,
   updatePokemon,
} = require('../controllers/pokemonControllers.js');
const { validationUpdate, validation } = require('../middleware/validation.js');

const {
   createPokemonSchema,
   updatePokemonSchema,
   getPokemonsSchema,
} = require('../validations/pokemonValidation.js');

router.get('/', validation(getPokemonsSchema), getPokemons);

router.get('/:pokeId', getPokemonId);

router.post(
   '/',
   validationUpdate,
   validation(createPokemonSchema),
   createPokemon,
);

router.put(
   '/:pokeId',
   validationUpdate,
   validation(updatePokemonSchema),
   updatePokemon,
);

router.delete('/:pokeId', validationUpdate, deletePokemon);

module.exports = router;
