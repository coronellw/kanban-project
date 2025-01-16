import type { AxiosResponse } from "axios"
import { useAtom, useSetAtom } from "jotai"
import { useState } from "react"
import { kanbanApi } from "~/api"

import { boardsAtom, selectedBoardAtom } from "~/store"

import type { IBoard, IColumn, ITask } from "~/types"

type ID = number | string

export const useBoard = (board?: IBoard) => {
  const reloadBoards = useSetAtom(boardsAtom)
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom)

  let currentBoard = board || selectedBoard

  if (!currentBoard) {
    currentBoard = { _id: '', name: '', columns: [], version: 0 }
  }

  const saveBoard = () => setSelectedBoard({ ...currentBoard, version: currentBoard.version ? currentBoard.version + 1 : 0 })

  // COLUMNS
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

  const addColumn = async (columnName: string, board: ID) => {
    const response: AxiosResponse<IColumn> = await kanbanApi.post("/columns", { name: columnName, board })
    currentBoard.columns.push({ ...response.data, tasks: [] })
    saveBoard()
    return response.data
  }

  const updateColumn = async (column: IColumn) => {
    await kanbanApi.patch(`/columns/${column._id}`, { ...column, _id: undefined })
    const columnIndex = findColumnIndex(column._id)
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
    const columnIndex = findColumnIndex(task.status as string)

    currentBoard.columns[columnIndex].tasks = [...currentBoard.columns[columnIndex].tasks, task]
    saveBoard()
  }

  const deleteTask = async (taskId: ID) => {
    await kanbanApi.delete(`/tasks/${taskId}`)

    const { taskIndex, column } = findTaskIndex(taskId)
    const columnIndex = findColumnIndex(column._id)

    currentBoard.columns[columnIndex].tasks.splice(taskIndex, 1)
    saveBoard()
  }

  const toggleSubTaskCompletion = async (task: ITask, subtaskId: ID) => {
    await kanbanApi.patch(`/tasks/${task._id}/subtask/toggle`, { subtaskId })
    const columnIndex = findColumnIndex(task.status as string)
    const { taskIndex } = findTaskIndex(task._id)

    currentBoard.columns[columnIndex].tasks[taskIndex].subtasks = currentBoard.columns[columnIndex].tasks[taskIndex].subtasks.map(st => st._id === subtaskId ? { ...st, completed: !st.completed } : st)
    saveBoard()
  }

  // BOARDS
  const addBoard = async (boardName: string, columns: string[] = []) => {
    const response: AxiosResponse<IBoard> = await kanbanApi.post("/boards", { name: boardName })
    const board = response.data
    const boardId = board._id

    const promisedColumns = columns.map(col => addColumn(col, boardId))
    await Promise.all(promisedColumns)
    reloadBoards()
  }

  const deleteBoard = async (boardId: ID) => {
    const response: AxiosResponse<IBoard> = await kanbanApi.delete(`/boards/${boardId}`)
    setSelectedBoard({ columns: [] as IColumn[] } as IBoard)
    if (response.status === 200) {
      reloadBoards()
    }
  }

  const updateBoard = async (board: Pick<IBoard, "name" | "owner" | "_id">, columns: { _id?: string, name: string }[]) => {
    let response
    if (board.name !== currentBoard.name) {
      response = await kanbanApi.patch(`/boards/${board._id}`, { name: board.name })
    }
    let promises = []
    if (!response || response.status === 202) {
      promises = columns.map(column => {
        const columnIndex = column._id ? findColumnIndex(column._id) : -1

        return columnIndex > 0 ? kanbanApi.patch(`/columns/${column._id}`, { name: column.name, board: board._id }) : addColumn(column.name, board._id)
      })
      await Promise.allSettled(promises)
    }
    reloadBoards()
    return currentBoard

  }


  return {
    board: currentBoard,
    findColumn,
    findColumnIndex,
    getColumnFromTaskId,
    addColumn,
    updateColumn,
    deleteColumn,
    findTask,
    findTaskIndex,
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