import { useAtom } from "jotai"

import { selectedBoardAtom } from "~/store"

import type { IBoard } from "~/types"

type ID = number | string

export const useBoard = (board?: IBoard) => {
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom)

  const currentBoard = board || selectedBoard

  if (!currentBoard) {
    return new Error("No board found, provide one or set the board atom")
  }

  const findColumnIndex = (columnId: ID) => currentBoard.columns.findIndex(c => c._id === columnId)

  const findColumn = (columnId: ID) => currentBoard.columns.find(c => c._id === columnId)

  const getColumnFromTaskId = (taskId: ID) => currentBoard.columns.find(col => col.tasks.some(task => task._id === taskId))

  const getColumnFromTaskIdOrError = (taskId: ID) => {
    const column = getColumnFromTaskId(taskId)

    if (!column) {
      throw new Error("TaskId not found")
    }

    return column
  }

  const findTaskIndex = (taskId: ID) => {
    const column = getColumnFromTaskIdOrError(taskId)

    return {
      column,
      taskIndex: column.tasks.findIndex(t => taskId === t._id)
    }
  }

  const findTask = (taskId: ID) => {
    const { column, taskIndex } = findTaskIndex(taskId)
    return column.tasks[taskIndex]
  }

  const moveTask = (taskId: ID, destinationColumn: ID) => {
    const { column, taskIndex } = findTaskIndex(taskId)
    const originColumnIndex = findColumnIndex(column._id)
    const destinationColumnIndex = findColumnIndex(destinationColumn)

    const task = currentBoard.columns[originColumnIndex].tasks[taskIndex]

    currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t._id !== taskId)
    currentBoard.columns[destinationColumnIndex].tasks = [...currentBoard.columns[destinationColumnIndex].tasks, task]

    setSelectedBoard(currentBoard)
  }


  return {
    board: currentBoard,
    findColumn,
    findColumnIndex,
    getColumnFromTaskId,
    findTask,
    findTaskIndex,
    moveTask,
  }
}