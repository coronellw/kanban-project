import { useCallback } from "react"
import type { AxiosResponse } from "axios"
import { kanbanApi } from "~/api"
import type { IBoard, IColumn } from "~/types"

type ID = number | string

/**
 * Hook for column API operations (CRUD)
 */
export const useColumnAPI = (
  currentBoard: IBoard,
  findColumnIndex: (columnId: ID) => number,
  saveBoard: () => void
) => {
  const addColumn = useCallback(async (columnName: string, boardId: ID) => {
    if (!boardId) {
      throw new Error('Invalid Board provided')
    }
    
    const response: AxiosResponse<IColumn> = await kanbanApi.post("/columns", { 
      name: columnName, 
      board: boardId 
    })
    
    currentBoard.columns.push({ ...response.data, tasks: [] })
    saveBoard()
    return response.data
  }, [currentBoard.columns, saveBoard])

  const updateColumn = useCallback(async (column: Omit<IColumn, "tasks">) => {
    const { id, __v, tasks, ...columnData } = column as any
    
    await kanbanApi.patch(`/columns/${column.id}`, columnData)
    
    const columnIndex = findColumnIndex(column.id)
    currentBoard.columns[columnIndex] = {
      ...column, 
      tasks: currentBoard.columns[columnIndex].tasks
    }
    saveBoard()
    return column
  }, [currentBoard.columns, findColumnIndex, saveBoard])

  const deleteColumn = useCallback(async (columnId: ID) => {
    const response: AxiosResponse<IColumn> = await kanbanApi.delete(`/columns/${columnId}`)
    currentBoard.columns = currentBoard.columns.filter(column => column.id !== columnId)
    saveBoard()
    return response.status === 202 ? response.data : null
  }, [currentBoard, saveBoard])

  return { addColumn, updateColumn, deleteColumn }
}
