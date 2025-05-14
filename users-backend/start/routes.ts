/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.resource('/users', '#controllers/users_controller').apiOnly()

router.get('/', async () => {
  return { message: 'API do CRUD de usuários está online' }
})

router.post('/login', '#controllers/users_controller.login')


