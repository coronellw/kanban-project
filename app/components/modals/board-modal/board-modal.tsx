import { useAtomValue, useSetAtom } from "jotai"
import { useRef, useState } from "react"
import { activeModalAtom, selectedBoardAtom } from "~/store"
import { v4 } from "uuid"

import Button from "~/ui/button"
import TextField from "~/ui/text-field"

import { kanbanApi } from "~/api"
import { useBoard } from "~/hooks/useBoard"

import type { AxiosResponse } from "axios"
import type { IBoard } from "~/types"

import boardStyles from "./board-modal.module.css"
import baseStyles from "../base-modal.module.css"

export const BoardModal = ({ isNew = false }: { isNew?: boolean }) => {
  const selectedBoard = useAtomValue(selectedBoardAtom)
  const setModal = useSetAtom(activeModalAtom)
  const formRef = useRef<HTMLFormElement>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState<boolean>(isNew)
  const { addBoard, updateColumn, findColumn, deleteColumn } = useBoard()

  const handleFormChange = () => {
    if (isNew || !selectedBoard || !formRef.current) return

    setHasChanges(isNew || hasUpdates(selectedBoard, formRef.current))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) {
      return
    }
    try {
      const formData = new FormData(formRef.current)

      const name = formData.get('name')
      const columnsNames = columns.map(c => formData.get(c) as string)

      let response: AxiosResponse<IBoard>

      if (isNew) {
        await addBoard(name as string, columnsNames)
        setModal(0)
        return
      }

      response = await kanbanApi.patch("/boards", { name })


    } catch (error) {

    }
  }
  const handleColumnDeletion = async (columnId: string) => {
    if (isNew) {
      setColumns(current => current.filter(col => col !== columnId))
      return
    }
    const column = findColumn(columnId)

    if (!column) {
      alert(`No column with id ${columnId} found to delete`)
      return
    }

    const hasTasks = column.tasks.length
    if (!!hasTasks) {
      const shouldContinue = confirm(`The column '${column.name}' has ${hasTasks} task(s), \nif you choose to continue all related tasks and subtasks will be deleted`)

      if (!shouldContinue) return

      await deleteColumn(columnId)
    }
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
  return board.name !== formData.get('name') || board.columns.some(col => col.name !== formData.get(col._id))
}

export default BoardModal