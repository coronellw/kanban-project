import { Form, redirect } from "react-router"
import type { Route } from "./+types/home"
import { login } from "~/authentication/user"

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
  const isLoggedIn = await login(email, password)

  if (isLoggedIn) {
    console.log('should redirect')
    return redirect("/home")
  }
  return { error: 'Invalid credentials' }
}

export default function Home({ actionData }: Route.ComponentProps) {

  if (actionData) {
    console.log({ error: actionData })
  }
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Form method="post" className="flex flex-col">
        <label htmlFor="email">e-mail: <input type="email" name="email" /></label>
        <label htmlFor="password">Password: <input type="password" name="password" /></label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}
