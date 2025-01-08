import { useAtomValue, useSetAtom } from "jotai"
import classNames from "classnames"
import { useBoard } from "~/hooks/useBoard"
import ConfirmBox from "~/components/confirm-box"
import { activeModalAtom, selectedTaskAtom } from "~/store"

import baseStyles from "../base-modal.module.css"
import styles from "./confirm-task-deletion.module.css"

export const ConfirmTaskDeletionModal = () => {
  const task = useAtomValue(selectedTaskAtom)
  const setModal = useSetAtom(activeModalAtom)
  const { deleteTask } = useBoard()
  if (!task) {
    return <div className="flex items-center px-4 py-8">No task selected!</div>
  }

  const handleDelete = () => {
    deleteTask(task._id)
    setModal(0)
  }

  return (
    <div className={baseStyles.baseModal}>
      <ConfirmBox
        denyText="Cancel"
        confirmText="Delete"
        onConfirm={handleDelete}
        onDeny={() => setModal(0)}
      >
        <div className={styles.content}>
          <span className={styles.title}>Delete this task?</span>
          <span className={styles.description}>
            Are you sure you want to delete the &apos;{task.title}&apos; task and its subtasks? This action cannot be reversed.
          </span>
        </div>
      </ConfirmBox>
    </div>
  )
}

export default ConfirmTaskDeletionModal