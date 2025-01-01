import Checkbox from "~/ui/toggle"
import styles from "./theme-switcher.module.css"
import { useAtom } from "jotai"
import { themeAtom } from "~/store"
import classNames from "classnames"

// TODO: use local storage to save the current selected theme
const ThemeSwitcher = ({ className }: React.ComponentPropsWithoutRef<'div'>) => {
  const [theme, setTheme] = useAtom(themeAtom)
  return (
    <div className={classNames(styles.wrapper, className)}>
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