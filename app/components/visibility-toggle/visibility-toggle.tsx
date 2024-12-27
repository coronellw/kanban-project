import { useAtom } from "jotai"
import styles from "./visibility-toggle.module.css"
import { isSidebarVisibleAtom } from "~/store"

// TODO: Rename to sidebar visibility or improve the name to something more specific
// ALT: you can also make the component more generic to be reusable
const Visibility = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom)

  const handleVisibilityChange = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <div className={styles.wrapper} onClick={handleVisibilityChange}>
      <span className={styles["icon-eye-closed"]}></span>
      Hide Sidebar
    </div>
  )
}

export default Visibility