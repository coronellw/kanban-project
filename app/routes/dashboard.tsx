import { useEffect } from "react"
import { redirect } from "react-router"
import useAuth from "~/hooks/useAuth"
import { getLoggedUser } from "~/authentication/user"
import DashboardComponent from "~/components/dashboard"

import type { Route } from "./+types/dashboard"


export async function clientLoader() {
  try {
    const user = await getLoggedUser()
    if (!user?.id) {
      return redirect("/")
    }
    return { user }
  } catch (error) {
    // No valid session, redirect to login
    console.log("No valid session, redirecting to login")
    return redirect("/")
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { login } = useAuth()

  // loaderData will only be an object with user if not redirected
  const userData = loaderData && 'user' in loaderData ? loaderData.user : null

  // Update the global user state with the loaded data
  useEffect(() => {
    if (userData?.id) {
      login(userData)
    }
  }, [userData, login])

  if (!userData) {
    return null
  }

  return <DashboardComponent />
}