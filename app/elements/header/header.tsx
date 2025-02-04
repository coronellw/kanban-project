import classNames from "classnames"
import styles from "./header.module.css"
import { useAtomValue, useSetAtom } from "jotai"

import { activeModalAtom, selectedBoardAtom, selectedTaskAtom } from "~/store"
import Button from "~/ui/button"
import { ModalWindows } from "~/types"
import { useCallback } from "react"
import { BoardMenu } from "../pop-over-menus"
import  AddTaskIcon from "~/assets/icon-add-task-mobile.svg"
import Title from "~/ui/title"

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
        <Title title={board?.name || ""} action={handleModal(ModalWindows.Sidebar)} />
        <span className={styles.cta}>
          <Button
            btnSize="large"
            btnType="primary"
            className={styles.desktop}
            onClick={handleNewTask}
            disabled={!board || !board.columns?.length}
          >
            + Add New Task
          </Button>
          <Button
            btnSize="large"
            btnType="primary"
            className={styles.mobile}
            disabled={!board || !board.columns?.length}
            onClick={handleNewTask}
          >
            <img src={AddTaskIcon} alt="add new task" />
          </Button>
          <BoardMenu />
        </span>
      </div>
    </header>
  )
}

export default Header