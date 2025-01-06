import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { useAtomValue } from "jotai"
import { ColumnsAtom } from "~/store"
import { kanbanApi } from "~/api"

import EmptyBoard from "./empty-board"

import Column from "~/components/column"
import AddNewColumn from "~/components/column/add-column"

import type { ITask } from "~/types"
import styles from "./board.module.css"
import { useBoard } from "~/hooks/useBoard"

const Board = () => {
  const columns = useAtomValue(ColumnsAtom)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { delay: 150, tolerance: 16 } })
  const touchSensor = useSensor(TouchSensor)

  const sensors = useSensors(mouseSensor, touchSensor)
  const { moveTask } = useBoard()

  if (!columns?.length) {
    return <EmptyBoard />
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className={styles.board}>
        {columns.map((col, index) => <Column key={col._id} column={col} index={index} />)}
        <AddNewColumn />
      </div>
    </DndContext>
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || !columns?.length) return

    const taskId = active.id
    const columnId = over.id
    const task = active.data.current as ITask

    if (columnId === task.status) {
      return
    }

    try {
      await kanbanApi.patch(`/tasks/${taskId}`, { status: columnId })

      moveTask(taskId, columnId)
    } catch (error) {
      console.error(error)
    }
  }
}

export default Board