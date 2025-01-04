import { Form } from "react-router"

import Button from "~/ui/button"
import TextField from "~/ui/text-field"

import styles from "./login.module.css"
import ThemeSwitcher from "~/components/theme-switcher"

const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.innerLogin}>
        <span className={styles.logo}>
        </span>
        <Form method="post" className={styles.form}>
          <div>
            <label htmlFor="email">e-mail:</label>
            <TextField type="email" name="email" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <TextField type="password" name="password" />
          </div>
          <span className={styles.cta}>
            <Button btnType="primary" type="submit">Log In</Button>
          </span>
        </Form>
      </div>
      <ThemeSwitcher className={styles.themeSwitcher} />
    </div>
  )
}

export default Login