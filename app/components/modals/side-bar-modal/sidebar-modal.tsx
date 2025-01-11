import Sidebar from "~/elements/sidebar"
import ThemeSwitcher from "../../theme-switcher"

import styles from "./sidebar-modal.module.css"

export const SidebarModal = () => {
  return <div className={styles.wrapper}>
    <Sidebar className="!flex" />
    <ThemeSwitcher />
  </div>
}

export default SidebarModal