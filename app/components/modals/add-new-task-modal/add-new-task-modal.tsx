import { useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"

import TextField from "~/ui/text-field"
import TextArea from "~/ui/text-area"
import Button from "~/ui/button"
import Select from "~/ui/select"

import { activeModalAtom, selectedBoardAtom } from "~/store"
import { capitalize } from "~/utils/capitalize"

import styles from "./add-new-task-modal.module.css"
import { v4 } from "uuid"
import { kanbanApi } from "~/api"

export const AddNewTaskModal = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const board = useAtomValue(selectedBoardAtom)
  const setActiveModal = useSetAtom(activeModalAtom)
  const states = useMemo(() => board?.columns.map(column => ({ value: column._id, label: capitalize(column.name) })), [board?.columns]) || []

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(states.length > 0 ? states[0].value : undefined)
  const [subtasks, setSubtasks] = useState<string[]>([])

  const handleValueChange = (value: string) => setSelectedStatus(value)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) {
      return
    }
    const formData = new FormData(formRef.current)
    const subt = subtasks.map(subtask => ({name: formData.get(subtask)}))
    const title = formData.get('title')
    const description = formData.get('description')
    try {
      const response = await kanbanApi.post("/tasks", { title, description, subtasks: subt, status: selectedStatus })
      console.log(response.data)
      setActiveModal(0)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form ref={formRef} className={styles.newTaskModal} onSubmit={handleSubmit}>
      <span className="text-heading-l">Add New Task</span>

      <div>
        <label htmlFor="title">Title</label>
        <TextField id="title" name="title" required />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <TextArea
          name="description"
          id="description"
          className="min-h-12 max-h-28"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="subtasks">Subtasks</label>
        {subtasks.map((subTask) => (
          <div className="flex items-center gap-4" key={subTask}>
            <TextField
              className="flex-1"
              name={subTask}
              id={subTask}
            />
            <span className={styles.closeIcon} onClick={() => { setSubtasks(current => current.filter(st => st !== subTask)) }}></span>
          </div>
        ))}

        <Button
          type="button"
          btnType="secondary"
          onClick={() => setSubtasks(current => [...current, v4()])}
        >
          +Add New Subtask
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status">Status</label>
        <Select
          className="w-full"
          options={states}
          value={selectedStatus}
          handleOptionChange={handleValueChange}
        />
      </div>

      <Button btnType="primary">Create Task</Button>
    </form>
  )
}

export default AddNewTaskModal