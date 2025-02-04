import { lazy, Suspense, useEffect, useRef } from "react"
import { useAtom } from "jotai"
import styles from "./backdrop.module.css"
import { activeModalAtom } from "~/store"
import { ModalWindows } from "~/types"

const BoardModal = lazy(() => import("~/components/modals/board-modal"))
const SidebarModal = lazy(() => import("~/components/modals/side-bar-modal"))
const ViewTaskModal = lazy(() => import("~/components/modals/view-task-modal"))
const AddNewTaskModal = lazy(() => import("~/components/modals/add-new-task-modal"))
const ConfirmBoardDeletion = lazy(() => import("~/components/modals/confirm-board-deletion"))
const ConfirmTaskDeletionModal = lazy(() => import("~/components/modals/confirm-task-deletion"))

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
    <Suspense fallback={"Loading..."}>
      {ModalWindows.Sidebar === activeModal && <SidebarModal />}
      {ModalWindows.AddNewTask === activeModal && <AddNewTaskModal />}
      {ModalWindows.ViewTask === activeModal && <ViewTaskModal />}
      {ModalWindows.AddNewBoard === activeModal && <BoardModal isNew />}
      {ModalWindows.EditBoard === activeModal && <BoardModal />}
      {ModalWindows.ConfirmTaskDeletion === activeModal && <ConfirmTaskDeletionModal />}
      {ModalWindows.confirmBoardDeletion === activeModal && <ConfirmBoardDeletion />}
    </Suspense>
  </div>
}

export default Backdrop