import { redirect } from "react-router"
import { login } from "~/authentication/user"
import Login from "~/elements/login"

import type { Route } from "./+types/home"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Kanban Client" },
    { name: "description", content: "Kanban Client by Wiston Coronell!" },
  ]
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: 'Unable to login' }
  }
  const user = await login(email, password)

  if (user) {
    return redirect("/home")
  }
  return { error: 'Invalid credentials' }
}

export default function Home() {
  return (
    <Login />
  )
}
