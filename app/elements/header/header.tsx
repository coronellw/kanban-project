import classNames from "classnames"
import styles from "./header.module.css"
import { useAtomValue, useSetAtom } from "jotai"

import { activeModalAtom, selectedBoardAtom } from "~/store"
import Button from "~/ui/button"
import DottedMenu from "~/ui/dotted-menu"
import { ModalWindows } from "~/types"
import { useCallback } from "react"

const Header = ({ className, ...props }: React.ComponentPropsWithoutRef<'header'>) => {
  const board = useAtomValue(selectedBoardAtom)
  const setOpenModal = useSetAtom(activeModalAtom)

  const handleModal = (modal: ModalWindows) => useCallback(() => {
    setOpenModal(modal)
  }, [modal])

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
            onClick={handleModal(ModalWindows.AddNewTask)}
            disabled={!board || !board.columns?.length}
          >
            + Add New Task
          </Button>
          <Button
            btnSize="large"
            btnType="primary"
            className={styles.buttonMobile}
            disabled={!board || !board.columns?.length}
            onClick={handleModal(ModalWindows.AddNewTask)}
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