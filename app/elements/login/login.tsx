import { Form, useNavigation } from "react-router"
import { useState } from "react"

import Button from "~/ui/button"
import TextField from "~/ui/text-field"

import styles from "./login.module.css"
import ThemeSwitcher from "~/components/theme-switcher"

interface LoginProps {
  error?: string
  defaultEmail?: string
}

const Login = ({ error, defaultEmail }: LoginProps) => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!email.includes('@')) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required")
      return false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")?.toString() || ""
    const password = formData.get("password")?.toString() || ""

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      event.preventDefault()
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.innerLogin}>
        <span className={styles.logo}>
        </span>
        <Form method="post" className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={{
              color: 'var(--error-color, #e74c3c)',
              backgroundColor: 'var(--error-bg, #fdf2f2)',
              border: '1px solid var(--error-border, #e74c3c)',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email">E-mail:</label>
            <TextField 
              id="email"
              type="email" 
              name="email" 
              defaultValue={defaultEmail || ''} 
              required 
              autoComplete="email"
              placeholder="Enter your email"
              errorMessage={emailError}
              onBlur={(e) => validateEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <TextField 
              id="password"
              type="password" 
              name="password" 
              required 
              autoComplete="current-password"
              placeholder="Enter your password"
              errorMessage={passwordError}
              onBlur={(e) => validatePassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <span className={styles.cta}>
            <Button 
              btnType="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </span>
        </Form>
      </div>
      <ThemeSwitcher className={styles.themeSwitcher} />
    </div>
  )
}

export default Login