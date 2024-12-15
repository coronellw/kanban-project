import type { AxiosResponse } from "axios"
import { kanbanApi } from "~/api"
interface IUser {
  _id: string
  name: string
  email: string
  tasks: ITask[]
  boards: IBoard[]
}

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ user: IUser, token: string }> = await kanbanApi.post("/users/login", { email, password })
    if (response.status === 200) {
      kanbanApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      localStorage.setItem('K-TOKEN', `${response.data.token}`)
      return true
    }
    return false
  } catch (error) {
    return false
  }

}

export const logout = async (): Promise<boolean> => {
  const response = await kanbanApi.delete('/users/logout')
  return response.status === 200
}

export const getLoggedUser = async (): Promise<IUser | undefined> => {
  if (!kanbanApi.defaults.headers.common['Authorization']) {
    const token = localStorage.getItem('K-TOKEN')
    if (!token) {
      return
    }
    kanbanApi.defaults.headers.common['Authorization'] = token
  }
  const response: AxiosResponse<IUser> = await kanbanApi.get('/users/me')
  return response.data
}
