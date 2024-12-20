import Checkbox from "~/ui/checkbox"
import styles from "./theme-switcher.module.css"
import { useAtom } from "jotai"
import { themeAtom } from "~/store"

const ThemeSwitcher = () => {
  const [theme, setTheme] = useAtom(themeAtom)
  return (
    <div className={styles.wrapper}>
      <span className={styles.light}></span>
      <Checkbox
        handleChange={(ts) => setTheme(ts.target.checked ? "dark" : "light")}
        checked={theme !== "light"}
      />
      <span className={styles.dark}></span>
    </div>
  )
}
export default ThemeSwitcher