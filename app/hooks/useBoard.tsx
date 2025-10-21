import { useAtom } from "jotai"
import { useCallback, useMemo } from "react"
import { selectedBoardAtom } from "~/store"
import type { IBoard } from "~/types"
import { useBoardColumns } from "./useBoardColumns"
import { useColumnAPI } from "./useColumnAPI"
import { useBoardTasks } from "./useBoardTasks"
import { useTaskAPI } from "./useTaskAPI"
import { useBoardAPI } from "./useBoardAPI"

/**
 * Main hook that orchestrates all board-related operations
 * by composing smaller, focused hooks
 */
export const useBoard = (board?: IBoard) => {
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom)
  
  // Memoize current board to prevent unnecessary recalculations
  const currentBoard = useMemo(
    () => board || selectedBoard || { id: '', name: '', columns: [], version: 0 },
    [board, selectedBoard]
  )

  // Memoize saveBoard to prevent recreating on every render
  const saveBoard = useCallback(() => {
    setSelectedBoard({ 
      ...currentBoard, 
      version: (currentBoard.version ?? 0) + 1 
    })
  }, [currentBoard, setSelectedBoard])

  // Column helpers
  const columnHelpers = useBoardColumns(currentBoard)

  // Column API operations
  const columnAPI = useColumnAPI(
    currentBoard, 
    columnHelpers.findColumnIndex, 
    saveBoard
  )

  // Task helpers
  const taskHelpers = useBoardTasks(columnHelpers.getColumnFromTaskIdOrError)

  // Task API operations
  const taskAPI = useTaskAPI(
    currentBoard,
    columnHelpers.findColumnIndex,
    taskHelpers.findTaskIndex,
    saveBoard
  )

  // Board API operations
  const boardAPI = useBoardAPI(
    currentBoard,
    setSelectedBoard,
    columnAPI.addColumn,
    columnAPI.updateColumn
  )

  // Return memoized API to prevent unnecessary re-renders
  return useMemo(() => ({
    board: currentBoard,
    // Column operations
    findColumn: columnHelpers.findColumn,
    findColumnIndex: columnHelpers.findColumnIndex,
    getColumnFromTaskId: columnHelpers.getColumnFromTaskId,
    addColumn: columnAPI.addColumn,
    updateColumn: columnAPI.updateColumn,
    deleteColumn: columnAPI.deleteColumn,
    // Task operations
    findTask: taskHelpers.findTask,
    findTaskIndex: taskHelpers.findTaskIndex,
    updateTask: taskAPI.updateTask,
    deleteTask: taskAPI.deleteTask,
    moveTask: taskAPI.moveTask,
    addTask: taskAPI.addTask,
    toggleSubTaskCompletion: taskAPI.toggleSubTaskCompletion,
    // Board operations
    addBoard: boardAPI.addBoard,
    deleteBoard: boardAPI.deleteBoard,
    updateBoard: boardAPI.updateBoard,
  }), [
    currentBoard,
    columnHelpers,
    columnAPI,
    taskHelpers,
    taskAPI,
    boardAPI,
  ])
}

export default useBoard