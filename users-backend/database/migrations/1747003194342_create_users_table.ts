import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('email').unique()
      table.string('password')
      table.enum('status', ['active', 'inactive'])
      table.enum('role', ['admin', 'user'])
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}