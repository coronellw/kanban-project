import Button from "~/ui/button"
import styles from "./board.module.css"
import { useSetAtom } from "jotai"
import { activeModalAtom } from "~/store"
import { ModalWindows } from "~/types"

const NoBoard = () => {
  const setModal = useSetAtom(activeModalAtom)
  return <div className="emptyBoard">
    <p className="text-heading-l text-center">No Board Selected, please select one or create a new one</p>
    <Button className="self-center" onClick={() => setModal(ModalWindows.AddNewBoard)}>+ Add New Board</Button>
  </div>
}

export default NoBoard