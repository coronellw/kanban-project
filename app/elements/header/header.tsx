import classNames from "classnames"
import styles from "./header.module.css"
import { useAtomValue, useSetAtom } from "jotai"

import { activeModalAtom, selectedBoardAtom } from "~/store"
import Button from "~/ui/button"
import DottedMenu from "~/ui/dotted-menu"
import { ModalWindows } from "~/types"

const Header = ({ className, ...props }: React.ComponentPropsWithoutRef<'header'>) => {
  const board = useAtomValue(selectedBoardAtom)
  const setOpenModal = useSetAtom(activeModalAtom)

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
          <Button className={styles["btn-normal"]} btnSize="large" btnType="primary" disabled={!board || !board.columns?.length}>
            + Add New Task
          </Button>
          <Button className={styles["btn-mobile"]} btnSize="large" btnType="primary" disabled={!board || !board.columns?.length}>
            +
          </Button>
          <DottedMenu onClick={() => setOpenModal(ModalWindows.Sidebar)} />
        </span>
      </div>
    </header>
  )
}

export default Header