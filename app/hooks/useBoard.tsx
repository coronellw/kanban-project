import { useAtom } from "jotai"

import { selectedBoardAtom } from "~/store"

import type { IBoard, ITask } from "~/types"

type ID = number | string

export const useBoard = (board?: IBoard) => {
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom)

  let currentBoard = board || selectedBoard

  if (!currentBoard) {
    // throw new Error("No board found, provide one or set the board atom")
    currentBoard = { _id: '', name: '', columns: [], version: 0 }
  }

  const saveBoard = () => setSelectedBoard({ ...currentBoard, version: currentBoard.version ? currentBoard.version + 1 : 0 })

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

  const updateTask = (task: ITask) => {
    const { column } = findTaskIndex(task._id)
    const originColumnIndex = findColumnIndex(column._id)

    if (task.status !== column._id) {
      const destinationColumnIndex = findColumnIndex(task.status as string)
      currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t._id !== task._id)
      currentBoard.columns[destinationColumnIndex].tasks = [...currentBoard.columns[destinationColumnIndex].tasks, task]
    } else {
      currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.map(t => t._id !== task._id ? t : task)
    }
    saveBoard()
  }

  const moveTask = (taskId: ID, destinationColumn: ID) => {
    const { column, taskIndex } = findTaskIndex(taskId)
    const originColumnIndex = findColumnIndex(column._id)
    const destinationColumnIndex = findColumnIndex(destinationColumn)

    const task = currentBoard.columns[originColumnIndex].tasks[taskIndex]
    if (task.status === destinationColumn) return

    task.status = destinationColumn as string

    currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t._id !== taskId)
    currentBoard.columns[destinationColumnIndex].tasks = [...currentBoard.columns[destinationColumnIndex].tasks, task]

    saveBoard()
  }

  const addTask = (task: ITask) => {
    const columnIndex = findColumnIndex(task._id)
    currentBoard.columns[columnIndex].tasks = [...currentBoard.columns[columnIndex].tasks, task]
    saveBoard()
  }


  return {
    board: currentBoard,
    findColumn,
    findColumnIndex,
    getColumnFromTaskId,
    findTask,
    findTaskIndex,
    updateTask,
    moveTask,
    addTask
  }
}