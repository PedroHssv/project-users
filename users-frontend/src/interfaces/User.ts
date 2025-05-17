export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

export interface User {
  id?: number
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  address: Address
}