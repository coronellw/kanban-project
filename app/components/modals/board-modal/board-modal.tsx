import { useAtomValue, useSetAtom } from "jotai"
import { useMemo, useRef, useState } from "react"
import { activeModalAtom, selectedBoardAtom } from "~/store"
import { v4 } from "uuid"

import Button from "~/ui/button"
import TextField from "~/ui/text-field"
import { useBoard } from "~/hooks/useBoard"

import type { IBoard } from "~/types"

import boardStyles from "./board-modal.module.css"
import baseStyles from "../base-modal.module.css"

export const BoardModal = ({ isNew = false }: { isNew?: boolean }) => {
  const selectedBoard = useAtomValue(selectedBoardAtom)
  const setModal = useSetAtom(activeModalAtom)
  const formRef = useRef<HTMLFormElement>(null)
  const initialColumns = useMemo(() => selectedBoard?.columns.map(c => c._id), [selectedBoard]) || []
  const [columns, setColumns] = useState<string[]>(isNew ? [] : initialColumns)
  const [hasChanges, setHasChanges] = useState<boolean>(isNew)
  const { addBoard, updateBoard, findColumn, deleteColumn } = useBoard()

  const handleFormChange = () => {
    if (isNew || !selectedBoard || !formRef.current) return

    setHasChanges(isNew || hasUpdates(selectedBoard, formRef.current))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || !selectedBoard) {
      return
    }
    try {
      const formData = new FormData(formRef.current)

      const name = formData.get('name')
      const columnsNames = columns.map(c => formData.get(c) as string)

      if (isNew) {
        await addBoard(name as string, columnsNames)
        setModal(0)
        return
      }
      const modifiedColumns = selectedBoard.columns
        .filter(col => col.name !== formData.get(col._id))
        .map(col => ({ ...col, name: formData.get(col._id) as string }))

      const existingColumnsIds = selectedBoard.columns.map(col => col._id)

      const newColumns = columns
        .filter(col => !existingColumnsIds.includes(col))
        .map(col => ({ name: formData.get(col) as string }))

      updateBoard({ _id: selectedBoard._id, name: name as string }, [...modifiedColumns, ...newColumns])
      setModal(0)
    } catch (error) {
      console.error(error)
    }
  }
  const handleColumnDeletion = async (columnId: string) => {
    if (isNew) {
      setColumns(current => current.filter(col => col !== columnId))
      return
    }
    const column = findColumn(columnId)

    if (column) {
      if (!!column.tasks.length) {
        const shouldContinue = confirm(`The column '${column.name}' has ${column.tasks.length} task(s), \nif you choose to continue all related tasks and subtasks will be deleted`)
        if (!shouldContinue) return
      }
      await deleteColumn(columnId)
    }

    setColumns(current => current.filter(col => col !== columnId))
  }

  return (
    < form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      className={baseStyles.baseModal}
    >
      <span className="text-heading-l">{isNew ? "Add New" : "Edit"} Board</span>

      <div>
        <label htmlFor="name">Name</label>
        <TextField id="name" name="name" required defaultValue={isNew ? undefined : selectedBoard?.name} />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="columns">Columns</label>
        {columns.map((column) => (
          <div className="flex items-center gap-4" key={column}>
            <TextField
              className="flex-1"
              name={column}
              id={column}
              defaultValue={findColumn(column)?.name}
            />
            <span className={baseStyles.closeIcon} onClick={() => handleColumnDeletion(column)}></span>
          </div>
        ))}

        <Button
          type="button"
          btnType="secondary"
          className="flex"
          onClick={() => setColumns(current => [...current, v4()])}
        >
          +Add New Column
        </Button>

        <Button
          disabled={!hasChanges}
          className="flex"
        >
          {isNew ? "Create New Board" : "Save Changes"}
        </Button>
      </div>
    </form >
  )
}

function hasUpdates(board: IBoard, form: HTMLFormElement): boolean {
  const formData = new FormData(form)
  const formObj = Object.entries(formData)
  const existingColumns = board.columns.map(c => c._id)
  existingColumns.push('name')
  const hasNewColumns = !!Object.keys(formObj).filter(k => existingColumns.includes(k))

  return board.name !== formData.get('name') || hasNewColumns || board.columns.some(col => col.name !== formData.get(col._id))
}

export default BoardModal