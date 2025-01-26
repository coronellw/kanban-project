import { useAtomValue, useSetAtom } from "jotai"
import ConfirmBox from "~/components/confirm-box"
import { activeModalAtom, selectedBoardAtom } from "~/store"
import { useBoard } from "~/hooks/useBoard"

import styles from "./confirm-board-deletion.module.css"
import baseStyles from "../base-modal.module.css"

export const ConfirmBoardDeletion = () => {
  const setModal = useSetAtom(activeModalAtom)
  const board = useAtomValue(selectedBoardAtom)
  const { deleteBoard } = useBoard()

  if (!board) {
    return <div className="flex items-center px-4 py-8">No board selected!</div>
  }

  const closeModal = () => setModal(0)

  const handleDelete = () => {
    deleteBoard(board._id)
    closeModal()
  }

  return (
    <div className={baseStyles.baseModal}>
      <ConfirmBox
        denyText="Cancel"
        confirmText="Delete"
        onConfirm={handleDelete}
        onDeny={closeModal}
      >
        <div className={styles.content}>
          <span className={styles.title}>Delete this board?</span>
          <span className={styles.description}>
            Are you sure you want to delete the &apos;{board.name}&apos; board? This action will remove all columns and tasks and cannot be reversed.
          </span>
        </div>
      </ConfirmBox>
    </div>
  )
}

export default ConfirmBoardDeletion