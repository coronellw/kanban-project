import { useSetAtom } from "jotai"
import { Form, redirect } from "react-router"
import { login } from "~/authentication/user"
import Button from "~/ui/button"

import type { Route } from "./+types/home"
import { userAtom } from "~/store"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
    <div className="w-full min-h-screen flex justify-center items-center">
      <Form method="post" className="flex flex-col">
        <label htmlFor="email">e-mail: <input type="email" name="email" /></label>
        <label htmlFor="password">Password: <input type="password" name="password" /></label>
        <span className="flex flex-col gap-4">
          <Button btnType="primary" type="submit">Log In</Button>
        </span>
      </Form>
    </div>
  )
}
