import DottedMenu from "~/ui/dotted-menu"
import PopOverMenu from "../pop-over-menu"

import { useAtomValue, useSetAtom } from "jotai"
import { activeModalAtom, selectedTaskAtom } from "~/store"

import { ModalWindows } from "~/types"
import styles from "./tasks-menu.module.css"

export const TaskMenu = () => {
  const setModal = useSetAtom(activeModalAtom)
  const selectedTask = useAtomValue(selectedTaskAtom)

  if (!selectedTask) {
    return
  }

  const handleDelete = () => {
    setModal(ModalWindows.ConfirmTaskDeletion)
  }

  return (
    <PopOverMenu className={styles.menuClasses} trigger={<DottedMenu />}>
      <div className={styles.taskMenu}>
        <span onClick={() => setModal(ModalWindows.AddNewTask)} >Edit Task</span>
        <span className="text-secondary" onClick={handleDelete}>Delete Task</span>
      </div>
    </PopOverMenu>
  )
}

export default TaskMenu