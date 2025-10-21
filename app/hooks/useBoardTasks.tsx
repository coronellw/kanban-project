import { useCallback } from "react"
import type { ITask } from "~/types"

type ID = number | string

/**
 * Hook for task-related helper operations
 */
export const useBoardTasks = (
  getColumnFromTaskIdOrError: (taskId: ID) => any
) => {
  const findTaskIndexOrThrow = useCallback((taskId: ID) => {
    const column = getColumnFromTaskIdOrError(taskId)
    const taskIndex = column.tasks.findIndex((t: ITask) => taskId === t.id)
    if (taskIndex === -1) throw new Error(`Task with ID ${taskId} not found`)
    return { column, taskIndex }
  }, [getColumnFromTaskIdOrError])

  const findTask = useCallback((taskId: ID) => {
    const { column, taskIndex } = findTaskIndexOrThrow(taskId)
    return column.tasks[taskIndex]
  }, [findTaskIndexOrThrow])

  return { findTask, findTaskIndex: findTaskIndexOrThrow }
}
