import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { ValidationException } from '@adonisjs/validator'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    if (error instanceof ValidationException) {
      return ctx.response.status(422).send({
        message: 'Erro de validação',
        errors: error.messages,
      })
    }

    if (error.status === 404) {
      return ctx.response.status(404).send({
        message: 'Rota não encontrada',
      })
    }

    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.status(401).send({
        message: 'Acesso não autorizado',
      })
    }

    if (error.status && error.message) {
      return ctx.response.status(error.status).send({
        message: error.message,
      })
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
