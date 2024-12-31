import { useAtom } from "jotai"
import { isSidebarVisibleAtom } from "~/store"

import styles from "./dashboard.module.css"
import Board from "~/components/board"

const Dashboard = () => {

  const [isSidebarVisible, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom)

  return (
    <div className={styles.dashboard}>
      <Board />

      {!isSidebarVisible && <div className={styles.viewWidget} onClick={() => setIsSidebarVisible(true)}>
        <span className={styles.viewIcon}></span>
      </div>}
    </div>
  )
}

export default Dashboard