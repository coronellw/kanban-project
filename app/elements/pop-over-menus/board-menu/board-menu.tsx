import PopOverMenu from "../pop-over-menu"
import { useAtom } from "jotai"
import { activeModalAtom } from "~/store"
import DottedMenu from "~/ui/dotted-menu"

import styles from "./board-menu.module.css"
import { ModalWindows } from "~/types"

type BoardMenuProps = { triggerClassName?: string } & React.ComponentPropsWithoutRef<'div'>

export const BoardMenu = ({ triggerClassName }: BoardMenuProps) => {
  const [modal, setModal] = useAtom(activeModalAtom)

  return (
    <PopOverMenu className={styles.menuClasses} align="end" trigger={<DottedMenu className={triggerClassName} />}>
      {modal === ModalWindows.None && <div className={styles.boardMenu}>
        <span onClick={() => setModal(ModalWindows.EditBoard)} >Edit Board</span>
        <span className="text-secondary" onClick={() => {setModal(ModalWindows.confirmBoardDeletion) }}>Delete Board</span>
      </div>}
    </PopOverMenu>
  )
}

export default BoardMenu