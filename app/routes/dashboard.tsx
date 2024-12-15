import { getLoggedUser } from "~/authentication/user"
import type { Route } from "./+types/dashboard"

export async function clientLoader() {
  const user = await getLoggedUser()
  if (!user) {
    throw new Response("No user logged in", { status: 401 })
  }
  return { user }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData ?? {}

  return <div><h2>Welcome {user.name}</h2></div>
}