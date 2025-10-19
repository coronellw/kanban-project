import type { AxiosResponse } from "axios"
import { kanbanApi } from "~/api"

import type { IUser } from "~/types"

const recoverSession = async (): Promise<boolean> => {
  if (!kanbanApi.defaults.headers.common['Authorization']) {
    const token = localStorage.getItem('K-TOKEN')
    if (!token) {
      return false
    }
    kanbanApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return true
}

export const login = async (email: string, password: string): Promise<IUser | null> => {
  try {
    const response: AxiosResponse<{ user: IUser, token: string }> = await kanbanApi.post("/users/login", { email, password })

    if (response.status === 200 && response.data.user && response.data.token) {
      const authHeader = `Bearer ${response.data.token}`
      kanbanApi.defaults.headers.common['Authorization'] = authHeader
      localStorage.setItem('K-TOKEN', response.data.token)
      return response.data.user
    }
    return null
  } catch (error) {
    console.error('Login failed:', error)
    return null
  }
}

export const logout = async (): Promise<boolean> => {
  try {
    const response = await kanbanApi.delete('/users/logout')

    // Clear local storage and headers regardless of response
    localStorage.removeItem('K-TOKEN')
    delete kanbanApi.defaults.headers.common['Authorization']

    return response.status === 200
  } catch (error) {
    // Clear local storage even if API call fails
    localStorage.removeItem('K-TOKEN')
    delete kanbanApi.defaults.headers.common['Authorization']
    console.error('Logout error:', error)
    return false
  }
}

export const getLoggedUser = async (): Promise<IUser | undefined> => {
  try {
    const hasSession = await recoverSession()
    if (!hasSession) {
      throw new Error("No valid session token")
    }

    const response: AxiosResponse<IUser> = await kanbanApi.get('/users/me')

    if (response.status === 200 && response.data?._id) {
      return response.data
    }

    throw new Error("Invalid user data received")
  } catch (error) {
    // Clear invalid session
    localStorage.removeItem('K-TOKEN')
    delete kanbanApi.defaults.headers.common['Authorization']
    throw error
  }
}
