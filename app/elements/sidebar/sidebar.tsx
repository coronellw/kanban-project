import { useAtomValue, useAtom, useSetAtom } from "jotai"
import { activeModalAtom, boardsAtom, selectedBoardAtom } from "~/store"

import styles from "./sidebar.module.css"
import classNames from "classnames"
import { ModalWindows, type IBoard } from "~/types"
import ThemeSwitcher from "~/components/theme-switcher"
import VisibilityToggle from "~/components/visibility-toggle"

const Sidebar = ({ className, ...props }: React.ComponentPropsWithoutRef<'aside'>) => {
  const boards = useAtomValue(boardsAtom)
  const setModal = useSetAtom(activeModalAtom)
  const [currentBoard, setCurrentBoard] = useAtom(selectedBoardAtom)

  const handleBoardSelection = (board: IBoard) => {
    setCurrentBoard(board)
  }

  return (
    <aside className={classNames(styles.sidebar, className)} {...props}>
      <nav className={styles.nav}>
        <h3 className={styles.title}>All Boards ({boards.length})</h3>
        <ul>
          {boards.map(b =>
            <li
              key={b._id}
              className={classNames(styles.board, {
                [styles['board-selected']]: b._id === currentBoard?._id
              })}
              onClick={() => handleBoardSelection(b)}
            >
              <span className={styles.icon}></span>
              <span>
                {b.name}
              </span>
            </li>
          )}
          <li className={classNames(styles.board, "text-primary")} onClick={() => setModal(ModalWindows.AddNewBoard)}>
            <span className={styles.icon}></span>
            <span>
              + Create New Board
            </span>
          </li>
        </ul>
      </nav>

      <span className={styles.options}>
        <ThemeSwitcher className={styles.theme} />
        <VisibilityToggle className={styles.toggle} />
      </span>
    </aside>
  )
}

export default Sidebar