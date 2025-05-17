import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class UsersController {
  async index({ request }: HttpContext) {
    const { search, orderBy = 'id', orderDirection = 'asc' } = request.qs()

    const users = await User.query()
      .if(search, (query) => {
        query.where('name', 'like', `%${search}%`)
             .orWhere('email', 'like', `%${search}%`)
      })
      .preload('address')
      .orderBy(orderBy, orderDirection)

    return users
  }

  async store({ request }: HttpContext) {
    const userPayload = request.only(['name', 'email', 'password', 'status', 'role'])
    const addressPayload = request.only(['street', 'city', 'state', 'zipCode'])

    const hashedPassword = await hash.make(userPayload.password)

    userPayload.password = hashedPassword

    const user = await User.create(userPayload)
    await user.related('address').create(addressPayload)

    await user.load('address')
    return user
  }

  async show({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('address')
    return user
  }

  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const userPayload = request.only(['name', 'email', 'status', 'role'])
    const addressPayload = request.only(['street', 'city', 'state', 'zipCode'])

    user.merge(userPayload)
    await user.save()

    const address = await user.related('address').query().first()
    if (address) {
      address.merge(addressPayload)
      await address.save()
    } else {
      await user.related('address').create(addressPayload)
    }

    await user.load('address')
    return user
  }

  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return { message: 'User deleted' }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(400).json({ message: 'User not found!' })
    }

    const passwordMatched = await hash.verify(user.password, password)

    if (!passwordMatched) {
      return response.status(400).json({ message: 'Incorrect password' })
    }

    return response.status(200).json({ message: 'Successful login', user })
  }
}
