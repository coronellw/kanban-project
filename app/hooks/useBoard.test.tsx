import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'jotai'
import useBoard from './useBoard'
import { kanbanApi } from '~/api'
import type { IBoard, IColumn, ITask } from '~/types'

// Mock the API
vi.mock('~/api', () => ({
  kanbanApi: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock axios response type
const createMockResponse = <T,>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {} as any,
})

describe('useBoard Hook', () => {
  const mockBoard: IBoard = {
    id: 'board-1',
    name: 'Test Board',
    owner: 'user-1',
    version: 0,
    columns: [
      {
        id: 'col-1',
        name: 'To Do',
        board: 'board-1',
        tasks: [
          {
            id: 'task-1',
            title: 'Task 1',
            description: 'Description 1',
            status: 'col-1',
            subtasks: [
              { id: 'sub-1', name: 'Subtask 1', completed: false },
              { id: 'sub-2', name: 'Subtask 2', completed: true },
            ],
          },
          {
            id: 'task-2',
            title: 'Task 2',
            description: 'Description 2',
            status: 'col-1',
            subtasks: [],
          },
        ],
      },
      {
        id: 'col-2',
        name: 'In Progress',
        board: 'board-1',
        tasks: [],
      },
    ],
  }

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Column Operations', () => {
    it('should find a column by ID', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const column = result.current.findColumn('col-1')
      expect(column).toBeDefined()
      expect(column?.name).toBe('To Do')
    })

    it('should return undefined for non-existent column', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const column = result.current.findColumn('non-existent')
      expect(column).toBeUndefined()
    })

    it('should add a new column', async () => {
      const mockColumn: IColumn = {
        id: 'col-3',
        name: 'Done',
        board: 'board-1',
        tasks: [],
      }

      vi.mocked(kanbanApi.post).mockResolvedValueOnce(
        createMockResponse(mockColumn)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.addColumn('Done', 'board-1')
      })

      expect(kanbanApi.post).toHaveBeenCalledWith('/columns', {
        name: 'Done',
        board: 'board-1',
      })
      expect(result.current.board.columns).toHaveLength(3)
      expect(result.current.board.columns[2].name).toBe('Done')
    })

    it('should throw error when adding column with invalid board', async () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await expect(
        act(async () => {
          await result.current.addColumn('Test', '')
        })
      ).rejects.toThrow('Invalid Board provided')
    })

    it('should update a column', async () => {
      const updatedColumn = {
        id: 'col-1',
        name: 'Updated To Do',
        board: 'board-1',
      }

      vi.mocked(kanbanApi.patch).mockResolvedValueOnce(
        createMockResponse(updatedColumn)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.updateColumn(updatedColumn)
      })

      expect(kanbanApi.patch).toHaveBeenCalledWith('/columns/col-1', {
        name: 'Updated To Do',
        board: 'board-1',
        id: undefined,
        __v: undefined,
        tasks: undefined,
      })
      expect(result.current.board.columns[0].name).toBe('Updated To Do')
    })

    it('should throw error when updating non-existent column', async () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await expect(
        act(async () => {
          await result.current.updateColumn({
            id: 'non-existent',
            name: 'Test',
            board: 'board-1',
          })
        })
      ).rejects.toThrow('Column with ID non-existent not found')
    })

    it('should delete a column', async () => {
      vi.mocked(kanbanApi.delete).mockResolvedValueOnce(
        createMockResponse(mockBoard.columns[0], 202)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.deleteColumn('col-1')
      })

      expect(kanbanApi.delete).toHaveBeenCalledWith('/columns/col-1')
      expect(result.current.board.columns).toHaveLength(1)
      expect(result.current.board.columns[0].id).toBe('col-2')
    })
  })

  describe('Task Operations', () => {
    it('should find a task by ID', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const task = result.current.findTask('task-1')
      expect(task).toBeDefined()
      expect(task.title).toBe('Task 1')
    })

    it('should throw error when finding non-existent task', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      expect(() => result.current.findTask('non-existent')).toThrow(
        'Task with ID non-existent not found'
      )
    })

    it('should get column from task ID', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const column = result.current.getColumnFromTaskId('task-1')
      expect(column).toBeDefined()
      expect(column?.id).toBe('col-1')
    })

    it('should add a new task', () => {
      const newTask: ITask = {
        id: 'task-3',
        title: 'New Task',
        description: 'New Description',
        status: 'col-1',
        subtasks: [],
      }

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      act(() => {
        result.current.addTask(newTask)
      })

      expect(result.current.board.columns[0].tasks).toHaveLength(3)
      expect(result.current.board.columns[0].tasks[2].title).toBe('New Task')
    })

    it('should update a task within same column', () => {
      const updatedTask: ITask = {
        id: 'task-1',
        title: 'Updated Task 1',
        description: 'Updated Description',
        status: 'col-1',
        subtasks: [],
      }

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      act(() => {
        result.current.updateTask(updatedTask)
      })

      expect(result.current.board.columns[0].tasks[0].title).toBe(
        'Updated Task 1'
      )
    })

    it('should move task to different column when status changes', () => {
      const updatedTask: ITask = {
        id: 'task-1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'col-2',
        subtasks: [],
      }

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      act(() => {
        result.current.updateTask(updatedTask)
      })

      expect(result.current.board.columns[0].tasks).toHaveLength(1)
      expect(result.current.board.columns[1].tasks).toHaveLength(1)
      expect(result.current.board.columns[1].tasks[0].id).toBe('task-1')
    })

    it('should move task between columns', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      act(() => {
        result.current.moveTask('task-1', 'col-2')
      })

      expect(result.current.board.columns[0].tasks).toHaveLength(1)
      expect(result.current.board.columns[1].tasks).toHaveLength(1)
      expect(result.current.board.columns[1].tasks[0].id).toBe('task-1')
      expect(result.current.board.columns[1].tasks[0].status).toBe('col-2')
    })

    it('should not move task if already in target column', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })
      const initialTaskCount = result.current.board.columns[0].tasks.length

      act(() => {
        result.current.moveTask('task-1', 'col-1')
      })

      expect(result.current.board.columns[0].tasks).toHaveLength(
        initialTaskCount
      )
    })

    it('should delete a task', async () => {
      vi.mocked(kanbanApi.delete).mockResolvedValueOnce(
        createMockResponse(null, 200)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.deleteTask('task-1')
      })

      expect(kanbanApi.delete).toHaveBeenCalledWith('/tasks/task-1')
      expect(result.current.board.columns[0].tasks).toHaveLength(1)
      expect(result.current.board.columns[0].tasks[0].id).toBe('task-2')
    })

    it('should toggle subtask completion', async () => {
      const task = mockBoard.columns[0].tasks[0]

      vi.mocked(kanbanApi.patch).mockResolvedValueOnce(
        createMockResponse(null, 200)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.toggleSubTaskCompletion(task, 'sub-1')
      })

      expect(kanbanApi.patch).toHaveBeenCalledWith(
        '/tasks/task-1/subtask/toggle',
        { subtaskId: 'sub-1' }
      )
      
      const updatedTask = result.current.board.columns[0].tasks[0]
      const subtask = updatedTask.subtasks.find((s) => s.id === 'sub-1')
      expect(subtask?.completed).toBe(true)
    })
  })

  describe('Board Operations', () => {
    it('should add a new board with columns', async () => {
      const newBoard: IBoard = {
        id: 'board-2',
        name: 'New Board',
        owner: 'user-1',
        version: 0,
        columns: [],
      }

      const newColumn: IColumn = {
        id: 'col-new',
        name: 'Test Column',
        board: 'board-2',
        tasks: [],
      }

      vi.mocked(kanbanApi.post)
        .mockResolvedValueOnce(createMockResponse(newBoard))
        .mockResolvedValueOnce(createMockResponse(newColumn))

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.addBoard('New Board', ['Test Column'])
      })

      expect(kanbanApi.post).toHaveBeenCalledWith('/boards', {
        name: 'New Board',
      })
      expect(kanbanApi.post).toHaveBeenCalledWith('/columns', {
        name: 'Test Column',
        board: 'board-2',
      })
    })

    it('should delete a board', async () => {
      vi.mocked(kanbanApi.delete).mockResolvedValueOnce(
        createMockResponse(mockBoard, 200)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.deleteBoard('board-1')
      })

      expect(kanbanApi.delete).toHaveBeenCalledWith('/boards/board-1')
    })

    it('should update board name', async () => {
      vi.mocked(kanbanApi.patch).mockResolvedValueOnce(
        createMockResponse({ ...mockBoard, name: 'Updated Board' }, 202)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.updateBoard(
          {
            id: 'board-1',
            name: 'Updated Board',
            owner: 'user-1',
          },
          []
        )
      })

      expect(kanbanApi.patch).toHaveBeenCalledWith('/boards/board-1', {
        name: 'Updated Board',
      })
    })

    it('should update board with new and existing columns', async () => {
      const mockColumnUpdate = {
        id: 'col-1',
        name: 'Updated To Do',
        board: 'board-1',
        tasks: [],
      }

      const mockNewColumn = {
        id: 'col-new',
        name: 'New Column',
        board: 'board-1',
        tasks: [],
      }

      vi.mocked(kanbanApi.patch)
        .mockResolvedValueOnce(createMockResponse(mockBoard, 202))
        .mockResolvedValueOnce(createMockResponse(mockColumnUpdate))

      vi.mocked(kanbanApi.post).mockResolvedValueOnce(
        createMockResponse(mockNewColumn)
      )

      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      await act(async () => {
        await result.current.updateBoard(
          {
            id: 'board-1',
            name: 'Test Board',
            owner: 'user-1',
          },
          [
            { id: 'col-1', name: 'Updated To Do' },
            { name: 'New Column' },
          ]
        )
      })

      expect(kanbanApi.patch).toHaveBeenCalledWith('/columns/col-1', {
        name: 'Updated To Do',
        board: 'board-1',
        id: undefined,
        __v: undefined,
        tasks: undefined,
      })

      expect(kanbanApi.post).toHaveBeenCalledWith('/columns', {
        name: 'New Column',
        board: 'board-1',
      })
    })
  })

  describe('Helper Functions', () => {
    it('should find column index', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const index = result.current.findColumnIndex('col-2')
      expect(index).toBe(1)
    })

    it('should throw error for non-existent column index', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      expect(() => result.current.findColumnIndex('non-existent')).toThrow(
        'Column with ID non-existent not found'
      )
    })

    it('should find task index', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const { taskIndex, column } = result.current.findTaskIndex('task-2')
      expect(taskIndex).toBe(1)
      expect(column.id).toBe('col-1')
    })

    it('should throw error for non-existent task index', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      expect(() => result.current.findTaskIndex('non-existent')).toThrow(
        'Task with ID non-existent not found'
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty board', () => {
      const emptyBoard: IBoard = {
        id: '',
        name: '',
        owner: '',
        version: 0,
        columns: [],
      }

      const { result } = renderHook(() => useBoard(emptyBoard), { wrapper })

      expect(result.current.board.columns).toHaveLength(0)
    })

    it('should handle board without selectedBoard prop', () => {
      const { result } = renderHook(() => useBoard(), { wrapper })

      expect(result.current.board).toBeDefined()
      expect(result.current.board.columns).toEqual([])
    })

    it('should increment board version on save', () => {
      const { result } = renderHook(() => useBoard(mockBoard), { wrapper })

      const initialVersion = result.current.board.version || 0

      act(() => {
        result.current.addTask({
          id: 'task-new',
          title: 'New Task',
          description: '',
          status: 'col-1',
          subtasks: [],
        })
      })

      expect(result.current.board.version).toBe(initialVersion + 1)
    })
  })
})
