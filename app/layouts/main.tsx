import { Outlet } from "react-router"
import Sidebar from "~/elements/sidebar"
import Header from "~/elements/header"
import Backdrop from "~/elements/backdrop"

import styles from "./main.module.css"

const MainLayout = () => {
  return (
    <div className={styles.wrapper}>
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