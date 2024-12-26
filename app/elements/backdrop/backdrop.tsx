import { useEffect, useRef } from "react"
import { useAtom } from "jotai"
import styles from "./backdrop.module.css"
import { activeModalAtom } from "~/store"
import Button from "~/ui/button"
import Sidebar from "~/elements/sidebar"
import { ModalWindows } from "~/types"

const Backdrop = () => {
  const [activeModal, setActiveModal] = useAtom(activeModalAtom)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log({target: event.target})
      if (backdropRef.current && backdropRef.current.isEqualNode(event.target as Node)) {
        setActiveModal(false)
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

  const handleBackdropClose = () => {
    setActiveModal('')
  }

  return <div className={styles.backdrop} aria-labelledby="modal-title" role="dialog" aria-modal="true" ref={backdropRef}>
    {ModalWindows.Sidebar === activeModal && <Sidebar className="!flex" onClick={() => setActiveModal(false)} />}
    <Button btnType="destructive" onClick={handleBackdropClose}>Close</Button>
  </div>
}

export default Backdrop