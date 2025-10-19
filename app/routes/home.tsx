import { redirect, useActionData } from "react-router"
import { login, getLoggedUser } from "~/authentication/user"
import Login from "~/elements/login"

import type { Route } from "./+types/home"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Kanban Client" },
    { name: "description", content: "Kanban Client by Wiston Coronell!" },
  ]
}

export async function clientLoader() {
  // Check if user is already logged in
  try {
    const user = await getLoggedUser()
    if (user?._id) {
      return redirect("/home")
    }
  } catch (error) {
    // User not logged in, continue to login page
    console.log("No active session found")
  }
  return null
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const email = formData.get("email")?.toString()?.trim()
  const password = formData.get("password")?.toString()

  // Input validation
  if (!email || !password) {
    return { 
      error: 'Email and password are required',
      email: email || '',
    }
  }

  if (!email.includes('@')) {
    return { 
      error: 'Please enter a valid email address',
      email,
    }
  }

  if (password.length < 6) {
    return { 
      error: 'Password must be at least 6 characters long',
      email,
    }
  }

  try {
    const user = await login(email, password)

    console.log({user, email, password})

    if (user?._id) {
      return redirect("/home")
    }
    
    return { 
      error: 'Invalid email or password. Please try again.',
      email,
    }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      error: 'Login failed. Please check your connection and try again.',
      email,
    }
  }
}

export default function Home() {
  const actionData = useActionData<typeof clientAction>()

  // Type guard for action data
  const isErrorResponse = (data: any): data is { error: string; email?: string } => {
    return data && typeof data === 'object' && 'error' in data
  }

  const errorData = isErrorResponse(actionData) ? actionData : null

  return (
    <Login 
      error={errorData?.error}
      defaultEmail={errorData?.email}
    />
  )
}
