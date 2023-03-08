# coderdex-be
url : http://localhost:5000

-  . api:

   -  user : ( you are user you have access token you can create,edit,delete pokemon)

      -  get `/user/login` login
      -  post `/user/register` sign up user
      -  put `/user/update` update info user

   -  pokemon: ( api you must login and have access token to use (post,put,delete))
      -  get `/pokemon/` get pokemon (have query)
      -  get `/pokemon/:pokeId` get pokemon Id
      -  post `/pokemon` create pokemon
      -  put `/pokemon/update` update info pokemon of author
      -  delete `/pokemon/:pokeId` delete pokemon of author ( not delete on db, just chance isDelete = true)

all api must match the requirement in folder validations
