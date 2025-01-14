import Button from "~/ui/button"
import styles from "./board.module.css"
import { useSetAtom } from "jotai"
import { activeModalAtom } from "~/store"
import { ModalWindows } from "~/types"

const EmptyBoard = () => {
  const setModal = useSetAtom(activeModalAtom)
  return <div className="emptyBoard">
    <p className="text-heading-l text-center">This board is empty. Create a new column to get started.</p>
    <Button onClick={() => setModal(ModalWindows.EditBoard)} className="self-center">+ Add New Column</Button>
  </div>
}

export default EmptyBoard