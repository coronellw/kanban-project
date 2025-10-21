import { useCallback } from "react"
import { useSetAtom } from "jotai"
import type { AxiosResponse } from "axios"
import { kanbanApi } from "~/api"
import { boardsAtom } from "~/store"
import type { IBoard, IColumn } from "~/types"

type ID = number | string

/**
 * Hook for board-level API operations
 */
export const useBoardAPI = (
  currentBoard: IBoard,
  setSelectedBoard: (board: IBoard) => void,
  addColumn: (name: string, boardId: ID) => Promise<IColumn>,
  updateColumn: (column: Omit<IColumn, "tasks">) => Promise<Omit<IColumn, "tasks">>
) => {
  const reloadBoards = useSetAtom(boardsAtom)

  const addBoard = useCallback(async (boardName: string, columns: string[] = []) => {
    const response: AxiosResponse<IBoard> = await kanbanApi.post("/boards", { name: boardName })
    const newBoard = response.data
    
    if (columns.length > 0) {
      await Promise.all(columns.map(col => addColumn(col, newBoard.id)))
    }
    
    reloadBoards()
  }, [addColumn, reloadBoards])

  const deleteBoard = useCallback(async (boardId: ID) => {
    const response: AxiosResponse<IBoard> = await kanbanApi.delete(`/boards/${boardId}`)
    setSelectedBoard({ id: '', name: '', columns: [] } as IBoard)
    
    if (response.status === 200) {
      reloadBoards()
    }
  }, [setSelectedBoard, reloadBoards])

  const updateBoard = useCallback(async (
    boardData: Pick<IBoard, "name" | "owner" | "id">, 
    columns: { id?: string; name: string }[]
  ) => {
    try {
      // Update board name if changed
      if (boardData.name !== currentBoard.name) {
        await kanbanApi.patch(`/boards/${boardData.id}`, { name: boardData.name })
      }

      // Update columns if provided
      if (columns.length > 0) {
        const columnPromises = columns.map(column => {
          if (column.id) {
            // Update existing column
            const existingColumn = currentBoard.columns.find(c => c.id === column.id)
            return existingColumn 
              ? updateColumn({ ...existingColumn, name: column.name })
              : Promise.resolve()
          } else {
            // Add new column
            return addColumn(column.name, boardData.id)
          }
        })

        await Promise.allSettled(columnPromises)
      }

      await reloadBoards()
      return currentBoard
    } catch (error) {
      console.error("Failed to update board:", error)
      throw error
    }
  }, [currentBoard, addColumn, updateColumn, reloadBoards])

  return { addBoard, deleteBoard, updateBoard }
}
