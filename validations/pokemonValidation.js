const yup = require('yup');
const type = [
   'normal',
   'fighting',
   'flying',
   'poison',
   'ground',
   'rock',
   'bug',
   'ghost',
   'steel',
   'fire',
   'water',
   'grass',
   'electric',
   'psychic',
   'ice',
   'dragon',
   'dark',
   'fairy',
];
const URL =
   /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
const getPokemonsSchema = yup.object().shape({
   id: yup.string().min(0, 'not have id'),
   name: yup.string().notRequired(),
   japanese_name: yup.string().notRequired(),
   type: yup
      .string()
      .lowercase()
      .oneOf(type, 'Please input correct type')
      .notRequired(),
   type1: yup
      .string()
      .lowercase()
      .oneOf(type, 'Please input correct type')
      .notRequired(),
   type2: yup
      .string()
      .lowercase()
      .oneOf(type, 'Please input correct type')
      .notRequired(),
   page: yup.number().positive('must positive numbles').default(1).required(),
});

const createPokemonSchema = yup.object().shape({
   id: yup.string().max(0, 'not have id'),
   name: yup.string().required(),
   japanese_name: yup.string().notRequired(),
   abilities: yup.array().of(yup.string()).min(1).notRequired(),
   imgPaths: yup
      .array()
      .of(yup.string().matches(URL, 'Enter a valid url').required())
      .min(1)
      .required('The pokemon must have one image '),
   type1: yup
      .string()
      .lowercase()
      .oneOf(type)
      .required('The pokemon must have one type'),
   type2: yup
      .string()
      .lowercase()
      .oneOf(type, 'Please input correct type')
      .notRequired(),
});

const updatePokemonSchema = yup.object().shape({
   id: yup.string().max(0, 'not have id'),
   name: yup.string().max(0, 'not cant change name'),
   abilities: yup.array().of(yup.string()).min(1).notRequired(),
   imgPaths: yup
      .array()
      .of(yup.string().matches(URL, 'Enter a valid url').required())
      .min(1)
      .notRequired(),
   type1: yup
      .string()
      .lowercase()
      .oneOf(type, 'The pokemon must have one type')
      .notRequired(),
   type2: yup
      .string()
      .lowercase()
      .oneOf(type, 'Please input correct type')
      .notRequired(),
});
module.exports = {
   createPokemonSchema,
   updatePokemonSchema,
   getPokemonsSchema,
};
