import { useAuth } from "~/hooks/useAuth"
import { getLoggedUser } from "~/authentication/user"
import DashboardComponent from "~/components/dashboard"

import type { Route } from "./+types/dashboard"


export async function clientLoader() {
  const user = await getLoggedUser()
  if (!user) {
    throw new Response("No user logged in", { status: 401 })
  }
  return { user }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user: userData } = loaderData
  const { login } = useAuth()

  // Update the global user state with the loaded data
  if (userData?._id) {
    login(userData)
  }

  if (!userData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: 'var(--text-primary, #333)'
      }}>
        Loading dashboard...
      </div>
    )
  }

  return <DashboardComponent />
}