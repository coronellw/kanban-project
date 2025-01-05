import classNames from "classnames"
import styles from "./header.module.css"
import { useAtomValue, useSetAtom } from "jotai"

import { activeModalAtom, selectedBoardAtom, selectedTaskAtom } from "~/store"
import Button from "~/ui/button"
import DottedMenu from "~/ui/dotted-menu"
import { ModalWindows } from "~/types"
import { useCallback } from "react"

const Header = ({ className, ...props }: React.ComponentPropsWithoutRef<'header'>) => {
  const board = useAtomValue(selectedBoardAtom)
  const setSelectedTask = useSetAtom(selectedTaskAtom)
  const setOpenModal = useSetAtom(activeModalAtom)

  const handleModal = (modal: ModalWindows) => useCallback(() => {
    setOpenModal(modal)
  }, [modal])

  const handleNewTask = () => {
    setSelectedTask(undefined)
    setOpenModal(ModalWindows.AddNewTask)
  }

  return (
    <header className={classNames(styles.header, className)} {...props}>
      <h1 className={styles.logo}>
        Kanban
      </h1>
      <div className={styles.details}>
        <span className={styles["board-name"]}>
          {board && board.name}
        </span>
        <span className={styles.cta}>
          <Button
            btnSize="large"
            btnType="primary"
            className={styles.buttonNormal}
            onClick={handleNewTask}
            disabled={!board || !board.columns?.length}
          >
            + Add New Task
          </Button>
          <Button
            btnSize="large"
            btnType="primary"
            className={styles.buttonMobile}
            disabled={!board || !board.columns?.length}
            onClick={handleNewTask}
          >
            +
          </Button>
          <DottedMenu onClick={handleModal(ModalWindows.Sidebar)} />
        </span>
      </div>
    </header>
  )
}

export default Header