import { useCallback, useMemo } from "react"
import type { IBoard, IColumn } from "~/types"

type ID = number | string

/**
 * Hook for column-related operations within a board
 */
export const useBoardColumns = (currentBoard: IBoard) => {
  const findColumn = useCallback(
    (columnId: ID) => currentBoard.columns.find(c => c.id === columnId),
    [currentBoard.columns]
  )

  const findColumnIndexOrThrow = useCallback((columnId: ID) => {
    const index = currentBoard.columns.findIndex(c => c.id === columnId)
    if (index === -1) throw new Error(`Column with ID ${columnId} not found`)
    return index
  }, [currentBoard.columns])

  const getColumnFromTaskId = useCallback((taskId: ID) => 
    currentBoard.columns.find(col => col.tasks.some(task => task.id === taskId)),
    [currentBoard.columns]
  )

  const getColumnFromTaskIdOrError = useCallback((taskId: ID) => {
    const column = getColumnFromTaskId(taskId)
    if (!column) throw new Error(`Task with ID ${taskId} not found`)
    return column
  }, [getColumnFromTaskId])

  return useMemo(() => ({
    findColumn,
    findColumnIndex: findColumnIndexOrThrow,
    getColumnFromTaskId,
    getColumnFromTaskIdOrError,
  }), [findColumn, findColumnIndexOrThrow, getColumnFromTaskId, getColumnFromTaskIdOrError])
}
