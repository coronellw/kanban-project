import type { AxiosResponse } from "axios"
import { useAtom, useSetAtom } from "jotai"
import { kanbanApi } from "~/api"
import { boardsAtom, selectedBoardAtom } from "~/store"
import type { IBoard, IColumn, ITask } from "~/types"

type ID = number | string

export const useBoard = (board?: IBoard) => {
  const reloadBoards = useSetAtom(boardsAtom)
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom)
  let currentBoard = board || selectedBoard || { _id: '', name: '', columns: [], version: 0 }

  const saveBoard = () => setSelectedBoard({ ...currentBoard, version: currentBoard.version ? currentBoard.version + 1 : 0 })

  // Helper function to find column index and throw error if not found
  const findColumnIndexOrThrow = (columnId: ID) => {
    const index = currentBoard.columns.findIndex(c => c._id === columnId)
    if (index === -1) throw new Error(`Column with ID ${columnId} not found`)
    return index
  }

  // Helper function to find task index and throw error if not found
  const findTaskIndexOrThrow = (taskId: ID) => {
    const column = getColumnFromTaskIdOrError(taskId)
    const taskIndex = column.tasks.findIndex(t => taskId === t._id)
    if (taskIndex === -1) throw new Error(`Task with ID ${taskId} not found`)
    return { column, taskIndex }
  }

  // COLUMNS
  const findColumn = (columnId: ID) => currentBoard.columns.find(c => c._id === columnId)
  const getColumnFromTaskId = (taskId: ID) => currentBoard.columns.find(col => col.tasks.some(task => task._id === taskId))
  const getColumnFromTaskIdOrError = (taskId: ID) => {
    const column = getColumnFromTaskId(taskId)
    if (!column) throw new Error(`Task with ID ${taskId} not found`)
    return column
  }

  const addColumn = async (columnName: string, board: ID) => {
    const response: AxiosResponse<IColumn> = await kanbanApi.post("/columns", { name: columnName, board })
    currentBoard.columns.push({ ...response.data, tasks: [] })
    saveBoard()
    return response.data
  }

  const updateColumn = async (column: IColumn) => {
    await kanbanApi.patch(`/columns/${column._id}`, { ...column, _id: undefined })
    const columnIndex = findColumnIndexOrThrow(column._id)
    currentBoard.columns[columnIndex] = column
    saveBoard()
    return column
  }

  const deleteColumn = async (columnId: ID) => {
    const response: AxiosResponse<IColumn> = await kanbanApi.delete(`/columns/${columnId}`)
    currentBoard.columns = currentBoard.columns.filter(column => column._id !== columnId)
    saveBoard()
    return response.status === 202 ? response.data : null
  }

  // TASKS
  const findTask = (taskId: ID) => {
    const { column, taskIndex } = findTaskIndexOrThrow(taskId)
    return column.tasks[taskIndex]
  }

  const updateTask = (task: ITask) => {
    const { column } = findTaskIndexOrThrow(task._id)
    const originColumnIndex = findColumnIndexOrThrow(column._id)
    if (task.status !== column._id) {
      const destinationColumnIndex = findColumnIndexOrThrow(task.status as string)
      currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t._id !== task._id)
      currentBoard.columns[destinationColumnIndex].tasks.push(task)
    } else {
      currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.map(t => t._id !== task._id ? t : task)
    }
    saveBoard()
  }

  const moveTask = (taskId: ID, destinationColumn: ID) => {
    const { column, taskIndex } = findTaskIndexOrThrow(taskId)
    const originColumnIndex = findColumnIndexOrThrow(column._id)
    const destinationColumnIndex = findColumnIndexOrThrow(destinationColumn)
    const task = currentBoard.columns[originColumnIndex].tasks[taskIndex]
    if (task.status === destinationColumn) return
    task.status = destinationColumn as string
    currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t._id !== taskId)
    currentBoard.columns[destinationColumnIndex].tasks.push(task)
    saveBoard()
  }

  const addTask = (task: ITask) => {
    const columnIndex = findColumnIndexOrThrow(task.status as string)
    currentBoard.columns[columnIndex].tasks.push(task)
    saveBoard()
  }

  const deleteTask = async (taskId: ID) => {
    await kanbanApi.delete(`/tasks/${taskId}`)
    const { taskIndex, column } = findTaskIndexOrThrow(taskId)
    const columnIndex = findColumnIndexOrThrow(column._id)
    currentBoard.columns[columnIndex].tasks.splice(taskIndex, 1)
    saveBoard()
  }

  const toggleSubTaskCompletion = async (task: ITask, subtaskId: ID) => {
    await kanbanApi.patch(`/tasks/${task._id}/subtask/toggle`, { subtaskId })
    const columnIndex = findColumnIndexOrThrow(task.status as string)
    const { taskIndex } = findTaskIndexOrThrow(task._id)
    const taskToUpdate = currentBoard.columns[columnIndex].tasks[taskIndex]
    taskToUpdate.subtasks = taskToUpdate.subtasks.map(st => st._id === subtaskId ? { ...st, completed: !st.completed } : st)
    saveBoard()
  }

  // BOARDS
  const addBoard = async (boardName: string, columns: string[] = []) => {
    const response: AxiosResponse<IBoard> = await kanbanApi.post("/boards", { name: boardName })
    const board = response.data
    await Promise.all(columns.map(col => addColumn(col, board._id)))
    reloadBoards()
  }

  const deleteBoard = async (boardId: ID) => {
    const response: AxiosResponse<IBoard> = await kanbanApi.delete(`/boards/${boardId}`)
    setSelectedBoard({ columns: [] as IColumn[] } as IBoard)
    if (response.status === 200) reloadBoards()
  }

  const updateBoard = async (board: Pick<IBoard, "name" | "owner" | "_id">, columns: { _id?: string, name: string }[]) => {
    let response
    if (board.name !== currentBoard.name) {
      response = await kanbanApi.patch(`/boards/${board._id}`, { name: board.name })
    }
    if (!response || response.status === 202) {
      await Promise.allSettled(columns.map(column => {
        const columnIndex = column._id ? findColumnIndexOrThrow(column._id) : -1
        return columnIndex > 0 ? kanbanApi.patch(`/columns/${column._id}`, { name: column.name, board: board._id }) : addColumn(column.name, board._id)
      }))
    }
    reloadBoards()
    return currentBoard
  }

  return {
    board: currentBoard,
    findColumn,
    findColumnIndex: findColumnIndexOrThrow,
    getColumnFromTaskId,
    addColumn,
    updateColumn,
    deleteColumn,
    findTask,
    findTaskIndex: findTaskIndexOrThrow,
    updateTask,
    deleteTask,
    moveTask,
    addTask,
    toggleSubTaskCompletion,
    addBoard,
    deleteBoard,
    updateBoard
  }
}