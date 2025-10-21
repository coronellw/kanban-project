import { useCallback } from "react"
import type { AxiosResponse } from "axios"
import { kanbanApi } from "~/api"
import type { IBoard, ITask } from "~/types"

type ID = number | string

/**
 * Hook for task API operations (CRUD)
 */
export const useTaskAPI = (
  currentBoard: IBoard,
  findColumnIndex: (columnId: ID) => number,
  findTaskIndex: (taskId: ID) => { column: any; taskIndex: number },
  saveBoard: () => void
) => {
  const updateTask = useCallback((task: ITask) => {
    const { column } = findTaskIndex(task.id)
    const originColumnIndex = findColumnIndex(column.id)
    
    if (task.status !== column.id) {
      // Move task to different column
      const destinationColumnIndex = findColumnIndex(task.status as string)
      currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t.id !== task.id)
      currentBoard.columns[destinationColumnIndex].tasks.push(task)
    } else {
      // Update task in same column
      currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.map(t => 
        t.id === task.id ? task : t
      )
    }
    saveBoard()
  }, [currentBoard.columns, findTaskIndex, findColumnIndex, saveBoard])

  const moveTask = useCallback((taskId: ID, destinationColumn: ID) => {
    const { column, taskIndex } = findTaskIndex(taskId)
    const task = column.tasks[taskIndex]
    
    // Early return if already in target column
    if (task.status === destinationColumn) return
    
    const originColumnIndex = findColumnIndex(column.id)
    const destinationColumnIndex = findColumnIndex(destinationColumn)
    
    task.status = destinationColumn as string
    currentBoard.columns[originColumnIndex].tasks = currentBoard.columns[originColumnIndex].tasks.filter(t => t.id !== taskId)
    currentBoard.columns[destinationColumnIndex].tasks.push(task)
    saveBoard()
  }, [currentBoard.columns, findTaskIndex, findColumnIndex, saveBoard])

  const addTask = useCallback((task: ITask) => {
    const columnIndex = findColumnIndex(task.status as string)
    currentBoard.columns[columnIndex].tasks.push(task)
    saveBoard()
  }, [currentBoard.columns, findColumnIndex, saveBoard])

  const deleteTask = useCallback(async (taskId: ID) => {
    await kanbanApi.delete(`/tasks/${taskId}`)
    const { taskIndex, column } = findTaskIndex(taskId)
    const columnIndex = findColumnIndex(column.id)
    currentBoard.columns[columnIndex].tasks.splice(taskIndex, 1)
    saveBoard()
  }, [currentBoard.columns, findTaskIndex, findColumnIndex, saveBoard])

  const toggleSubTaskCompletion = useCallback(async (task: ITask, subtaskId: ID) => {
    await kanbanApi.patch(`/tasks/${task.id}/subtask/toggle`, { subtaskId })
    const columnIndex = findColumnIndex(task.status as string)
    const { taskIndex } = findTaskIndex(task.id)
    const taskToUpdate = currentBoard.columns[columnIndex].tasks[taskIndex]
    
    taskToUpdate.subtasks = taskToUpdate.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    saveBoard()
  }, [currentBoard.columns, findTaskIndex, findColumnIndex, saveBoard])

  return { updateTask, moveTask, addTask, deleteTask, toggleSubTaskCompletion }
}
