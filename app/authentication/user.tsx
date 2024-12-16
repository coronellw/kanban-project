import type { AxiosResponse } from "axios"
import { kanbanApi } from "~/api"

import type { IUser } from "~/types"

const recoverSession = async () => {
  if (!kanbanApi.defaults.headers.common['Authorization']) {
    const token = localStorage.getItem('K-TOKEN')
    if (!token) {
      throw new Error("Unauthorized session")
    }
    kanbanApi.defaults.headers.common['Authorization'] = token
  }
}

export const login = async (email: string, password: string): Promise<IUser | null> => {
  try {
    const response: AxiosResponse<{ user: IUser, token: string }> = await kanbanApi.post("/users/login", { email, password })
    if (response.status === 200) {
      kanbanApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      localStorage.setItem('K-TOKEN', `${response.data.token}`)
      return response.data.user
    }
    return null
  } catch (error) {
    return null
  }

}

export const logout = async (): Promise<boolean> => {
  const response = await kanbanApi.delete('/users/logout')
  return response.status === 200
}

export const getLoggedUser = async (): Promise<IUser | undefined> => {
  recoverSession()
  const response: AxiosResponse<IUser> = await kanbanApi.get('/users/me')
  return response.data
}
