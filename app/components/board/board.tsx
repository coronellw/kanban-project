import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { useAtom } from "jotai"
import { selectedBoardAtom } from "~/store"
import { kanbanApi } from "~/api"

import EmptyBoard from "./empty-board"

import Column from "~/components/column"
import AddNewColumn from "~/components/column/add-column"

import type { ITask } from "~/types"
import styles from "./board.module.css"

const Board = () => {
  const [board, setBoard] = useAtom(selectedBoardAtom)

  if (!board || !board.columns.length) {
    return <EmptyBoard />
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {board.columns.map((col, index) => <Column key={col._id} column={col} index={index} />)}
        <AddNewColumn />
      </div>
    </DndContext>
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || !board) return

    const taskId = active.id
    const columnId = over.id
    const task = active.data.current as ITask

    if (columnId === task.status) {
      return
    }

    const originColumnIndex = board.columns.findIndex(c => c._id === task.status)
    const destinationColumnIndex = board.columns.findIndex(c => c._id === columnId)

    if (destinationColumnIndex < 0) {
      console.error(`Destination column ${columnId} not found in board ${board._id}`)
      return
    }

    try {
      await kanbanApi.patch(`/tasks/${taskId}`, { status: columnId })

      const updatedBoard = { ...board }
      updatedBoard.columns[destinationColumnIndex].tasks.push({ ...task, status: columnId as string })

      if (originColumnIndex >= 0) {
        updatedBoard.columns[originColumnIndex].tasks = updatedBoard.columns[originColumnIndex].tasks.filter(t => t._id !== task._id)
      }

      setBoard(updatedBoard)
    } catch (error) {
      console.error(error)
    }
  }
}

export default Board