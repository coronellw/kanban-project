import { useAtom } from "jotai"
import classNames from "classnames"
import { isSidebarVisibleAtom } from "~/store"

import styles from "./visibility-toggle.module.css"

// TODO: Rename to sidebar visibility or improve the name to something more specific
// ALT: you can also make the component more generic to be reusable
const Visibility = ({className}: {className?: string}) => {
  const [isSidebarVisible, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom)

  const handleVisibilityChange = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <div className={classNames(styles.visibility, className)} onClick={handleVisibilityChange}>
      <span className={styles["icon-eye-closed"]}></span>
      Hide Sidebar
    </div>
  )
}

export default Visibility