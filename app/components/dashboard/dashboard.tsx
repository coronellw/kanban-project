import { useAtom, useAtomValue } from "jotai"
import { isSidebarVisibleAtom, selectedBoardAtom } from "~/store"
import EmptyBoard from "./empty-board"

import styles from "./dashboard.module.css"
import TaskColumns from "./taskColumns"

const Dashboard = () => {
  const board = useAtomValue(selectedBoardAtom)
  const [isSidebarVisible, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom)

  if (!board?.columns.length) {
    return <EmptyBoard />
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-full w-5/6 mx-auto">
      <h2 className="text-heading-l">Welcome</h2>
      {board && <TaskColumns columns={board.columns} />}
      {!isSidebarVisible && <div className={styles.viewWidget} onClick={() => setIsSidebarVisible(true)}>
        <span className={styles.viewIcon}></span>
      </div>}
    </div>
  )
}

export default Dashboard