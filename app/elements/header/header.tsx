import classNames from "classnames"
import styles from "./header.module.css"
import { useAtomValue } from "jotai"

import { selectedBoardAtom } from "~/store"
import Button from "~/ui/button"
import DottedMenu from "~/ui/dotted-menu"

const Header = ({className, ...props}:React.ComponentPropsWithoutRef<'header'>) => {
  const board = useAtomValue(selectedBoardAtom)
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
          <Button btnSize="large" btnType="primary" disabled={!board || !board.columns}>+ Add New Task</Button>
          <DottedMenu />
        </span>
      </div>
    </header>
  )
}

export default Header