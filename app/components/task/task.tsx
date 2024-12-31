import { useDraggable } from "@dnd-kit/core"
import classNames from "classnames"
import type { ITask } from "~/types"

import styles from "./task.module.css"

const Task = ({ task }: { task: ITask }) => {
  const { attributes, listeners, transform, setNodeRef: dragRef } = useDraggable({
    id: task._id,
    data: task
  })

  const customStyles = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  }

  return (
    <div
      ref={dragRef}
      style={customStyles}
      {...attributes}
      {...listeners}
      className={classNames(styles.task)}
    >
      <div className={styles.title}>{task.title}</div>
      <div className="text-body-m">
        {task.subtasks?.filter(t => t.completed)?.length} of {task.subtasks?.length} subtasks
      </div>
    </div>
  )
}

export default Task