import { useEffect, useRef } from "react"
import { useAtom } from "jotai"
import styles from "./backdrop.module.css"
import { activeModalAtom } from "~/store"
import { SidebarModal, AddNewTaskModal, ViewTaskModal, BoardModal, ConfirmTaskDeletionModal } from "~/components/modals"
import { ModalWindows } from "~/types"

const Backdrop = () => {
  const [activeModal, setActiveModal] = useAtom(activeModalAtom)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (backdropRef.current && backdropRef.current.isEqualNode(event.target as Node)) {
        setActiveModal(0)
      }
    }

    if (activeModal) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeModal, setActiveModal])

  if (!activeModal) {
    return null
  }

  return <div className={styles.backdrop} aria-labelledby="modal-title" role="dialog" aria-modal="true" ref={backdropRef}>
    {ModalWindows.Sidebar === activeModal && <SidebarModal />}
    {ModalWindows.AddNewTask === activeModal && <AddNewTaskModal />}
    {ModalWindows.ViewTask === activeModal && <ViewTaskModal />}
    {ModalWindows.AddNewBoard === activeModal && <BoardModal isNew />}
    {ModalWindows.ConfirmTaskDeletion === activeModal && <ConfirmTaskDeletionModal />}
  </div>
}

export default Backdrop