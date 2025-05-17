import axios from 'axios'
import type { User } from 'src/interfaces/User'

const BASE = 'http://localhost:3333/users'

export type UserPayload = Partial<Omit<User, 'address'>> & {
  street: string
  city: string
  state: string
  zipCode: string
}

export function useUsers() {
  const getUsers = async (): Promise<User[]> =>
    (await axios.get(BASE)).data

  const createUser = async (payload: UserPayload) =>
    axios.post(BASE, payload)

  const updateUser = async (id: number, payload: UserPayload) =>
    axios.put(`${BASE}/${id}`, payload)

  const deleteUser = async (id: number) =>
    axios.delete(`${BASE}/${id}`)

  return { getUsers, createUser, updateUser, deleteUser }
}