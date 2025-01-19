import { useDroppable } from "@dnd-kit/core"
import Task from "~/components/task"
import type { IColumn } from "~/types"

import styles from "./column.module.css"
import classNames from "classnames"

const colors = [
  "#49C4E5",
  "#8471F2",
  "#67E2AE"
]

const Column = ({ column, index }: { column: IColumn, index: number }) => {
  const { setNodeRef: dropRef, isOver } = useDroppable({ id: column._id })
  const style = { backgroundColor: column.color || colors[index % colors.length] }
  return (
    <>

      <div
        ref={dropRef}
        className={classNames(styles.column, { [styles.active]: isOver })}
      >
        <span className={styles.columnHeader}>
          <span className={styles.columnColorCircle} style={style}></span>
          <h2>{column.name} ({column.tasks.length})</h2>
        </span>
        {column.tasks.map(task => <Task key={task._id} task={task} />)}
      </div>
    </>
  )
}

export default Column