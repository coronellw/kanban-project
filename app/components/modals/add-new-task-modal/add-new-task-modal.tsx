import { useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import type { AxiosResponse } from "axios"
import { v4 } from "uuid"

import TextField from "~/ui/text-field"
import TextArea from "~/ui/text-area"
import Button from "~/ui/button"
import Select from "~/ui/select"

import { activeModalAtom, ColumnsAtom, selectedTaskAtom } from "~/store"
import { capitalize } from "~/utils/capitalize"
import { kanbanApi } from "~/api"

import { useBoard } from "~/hooks/useBoard"

import type { ISubTask, ITask } from "~/types"

import addNewTaskModalStyles from "./add-new-task-modal.module.css"
import baseStyles from "../base-modal.module.css"


export const AddNewTaskModal = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const columns = useAtomValue(ColumnsAtom)
  const setActiveModal = useSetAtom(activeModalAtom)
  const [selectedTask, setSelectedTask] = useAtom(selectedTaskAtom)
  const states = useMemo(() =>columns?.map(column => ({ value: column._id, label: capitalize(column.name) })), [columns]) || []
  const existingSubtasks = useMemo(() => selectedTask?.subtasks.map(s => `${s._id}`), [selectedTask?.subtasks]) || []

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(selectedTask?.status || states[0]?.value)
  const [subtasks, setSubtasks] = useState<string[]>(existingSubtasks)
  const [isNew] = useState<boolean>(!selectedTask?._id)
  const [hasChanges, setHasChanges] = useState<boolean>(isNew)

  const { addTask, updateTask } = useBoard()

  const handleStatusChange = (value: string) => setSelectedStatus(value)

  const handleFormChange = () => {
    if (isNew || !selectedTask || !formRef.current) return

    setHasChanges(isNew || hasUpdates(selectedTask, formRef.current))
  }

  const handleAddNewSubtask = () => {
    setSubtasks(current => [...current, v4()])
    handleFormChange()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const subt = subtasks.map(subtask => {
      const originalTask: ISubTask = selectedTask?.subtasks.find(st => st._id === subtask) || {} as ISubTask
      return { ...originalTask, name: formData.get(subtask) }
    })
    const title = formData.get('title')
    const description = formData.get('description')

    try {
      let response: AxiosResponse<ITask>
      if (!!selectedTask?._id) {
        response = await kanbanApi.patch(`/tasks/${selectedTask._id}`, { title, description, subtasks: subt, status: selectedStatus })
      } else {
        response = await kanbanApi.post("/tasks", { title, description, subtasks: subt, status: selectedStatus })
      }

      if (response.status === 202) {
        updateTask(response.data)
      } else {
        addTask(response.data)
      }
      setSelectedTask(undefined)
      setActiveModal(0)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      className={baseStyles.baseModal}
    >
      <span className="text-heading-l">{isNew ? "Add New" : "Edit"} Task</span>

      <div>
        <label htmlFor="title">Title</label>
        <TextField id="title" name="title" required defaultValue={selectedTask?.title} />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <TextArea
          name="description"
          id="description"
          defaultValue={selectedTask?.description}
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
              defaultValue={selectedTask?.subtasks.find(s => s._id === subTask)?.name}
            />
            <span className={baseStyles.closeIcon} onClick={() => setSubtasks(current => current.filter(st => st !== subTask))}></span>
          </div>
        ))}

        <Button
          type="button"
          className="flex"
          btnType="secondary"
          onClick={handleAddNewSubtask}
        >
          +Add New Subtask
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status">Status</label>
        <Select
          id="status"
          name="status"
          options={states}
          value={selectedStatus}
          handleOptionChange={handleStatusChange}
        />
      </div>

      <Button
        btnType="primary"
        className="flex"
        disabled={!hasChanges}
      >
        {isNew ? "Create Task" : "Save Changes"}
      </Button>
    </form>
  )
}

function hasUpdates(task: ITask, form: HTMLFormElement): boolean {
  const formData = new FormData(form)

  const staticFields = ['title','description','status']
  const formObj = Object.fromEntries(formData)
  const subtaskCount = Object.keys(formObj).filter(k => !staticFields.includes(k))

  return formData.get('title') !== task.title
    || formData.get('description') !== task.description
    || formData.get('status') !== task.status
    || task.subtasks.length !== subtaskCount.length
    || task.subtasks.some(st => formData.get(st._id as string) !== st.name)
}

export default AddNewTaskModal