import { useSetAtom } from "jotai"
import styles from "./column.module.css"
import { activeModalAtom } from "~/store"
import { ModalWindows } from "~/types"
const AddColumn = () => {
  const setModal = useSetAtom(activeModalAtom)
  return <div onClick={() => setModal(ModalWindows.EditBoard)} className={styles.addNewColumn}>+ new column</div>
}

export default AddColumn