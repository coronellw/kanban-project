import { useAtom } from "jotai"
import { useNavigate } from "react-router"
import { useCallback, useEffect, useState } from "react"

import { userAtom } from "~/store"
import { getLoggedUser, logout } from "~/authentication/user"
import type { IUser } from "~/types"

export interface UseAuthReturn {
  user: IUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: IUser) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useAtom(userAtom)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const isAuthenticated = Boolean(user?._id)

  const loginUser = useCallback((userData: IUser) => {
    setUser(userData)
  }, [setUser])

  const logoutUser = useCallback(async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser({} as IUser)
      navigate("/", { replace: true })
    }
  }, [setUser, navigate])

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const loggedUser = await getLoggedUser()
      
      if (loggedUser?._id) {
        setUser(loggedUser)
        return true
      }
      
      setUser({} as IUser)
      navigate("/", { replace: true })
      return false
    } catch (error) {
      console.log("No valid session found, redirecting to login")
      setUser({} as IUser)
      navigate("/", { replace: true })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [setUser, navigate])

  return {
    user: user?._id ? user : null,
    isLoading,
    isAuthenticated,
    login: loginUser,
    logout: logoutUser,
    checkAuth,
  }
}

export default useAuth