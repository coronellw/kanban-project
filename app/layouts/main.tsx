import classNames from "classnames"
import { useAtomValue } from "jotai"
import { Outlet } from "react-router"
import Sidebar from "~/elements/sidebar"
import Header from "~/elements/header"
import Backdrop from "~/elements/backdrop"
import { isSidebarVisibleAtom } from "~/store"

import styles from "./main.module.css"

const MainLayout = () => {
  const isSidebarVisible = useAtomValue(isSidebarVisibleAtom)
  return (
    <div className={classNames(styles.wrapper, {sidebarClosed: !isSidebarVisible})}>
      <Header />

      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Backdrop />
    </div>
  )
}

export default MainLayout