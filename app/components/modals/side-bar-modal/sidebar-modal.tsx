import Sidebar from "~/elements/sidebar"
import { useSetAtom } from "jotai"
import { activeModalAtom } from "~/store"
import ThemeSwitcher from "../../theme-switcher"

import styles from "./sidebar-modal.module.css"

export const SidebarModal = () => {
  const setActiveModal = useSetAtom(activeModalAtom)
  return <div className={styles.wrapper}>
    <Sidebar className="!flex" onClick={() => setActiveModal(0)} />
    <ThemeSwitcher />
  </div>
}

export default SidebarModal