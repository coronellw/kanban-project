import { useDraggable } from "@dnd-kit/core"
import { ModalWindows, type ITask } from "~/types"

import styles from "./task.module.css"
import { useSetAtom } from "jotai"
import { selectedTaskAtom } from "~/store/taskAtoms"
import { activeModalAtom } from "~/store"

const Task = ({ task }: { task: ITask }) => {
  const setSelectedTask = useSetAtom(selectedTaskAtom)
  const setModal = useSetAtom(activeModalAtom)
  const { attributes, listeners, transform, setNodeRef: dragRef } = useDraggable({
    id: task._id,
    data: task
  })

  const customStyles = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  }

  const updateSelectedTask = (task:ITask) => {
    setSelectedTask(task)
    setModal(ModalWindows.AddNewTask)
  }

  return (
    <div
      ref={dragRef}
      style={customStyles}
      {...attributes}
      {...listeners}
      onClick={() => updateSelectedTask(task)}
      className={styles.task}
    >
      <div className={styles.title}>{task.title}</div>
      <div className="text-body-m">
        {task.subtasks?.filter(t => t.completed)?.length} of {task.subtasks?.length} subtasks
      </div>
    </div>
  )
}

export default Task