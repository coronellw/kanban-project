import { useEffect, useMemo, useRef, useState } from "react"
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

import useBoard from "~/hooks/useBoard"

import type { ISubTask, ITask } from "~/types"

import addNewTaskModalStyles from "./add-new-task-modal.module.css"
import baseStyles from "../base-modal.module.css"
import { validateForm } from "~/utils"


export const AddNewTaskModal = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const columns = useAtomValue(ColumnsAtom)
  const setActiveModal = useSetAtom(activeModalAtom)
  const [selectedTask, setSelectedTask] = useAtom(selectedTaskAtom)
  
  const states = useMemo(() => 
    columns?.map(column => ({ value: column.id, label: capitalize(column.name) })) || [], 
    [columns]
  )
  
  const isNew = !selectedTask?.id
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(selectedTask?.status || states[0]?.value)
  const [subtasks, setSubtasks] = useState<string[]>(() => 
    selectedTask?.subtasks.map(s => s.id || v4()) || []
  )
  const [errors, setErrors] = useState<Record<string, string>>({}) 
  const [hasChanges, setHasChanges] = useState<boolean>(isNew)

  const { addTask, updateTask } = useBoard()

  // Reset form state when selectedTask changes
  useEffect(() => {
    setSelectedStatus(selectedTask?.status || states[0]?.value)
    setSubtasks(selectedTask?.subtasks.map(s => s.id || v4()) || [])
    setHasChanges(isNew)
    setErrors({})
  }, [selectedTask?.id, states, isNew])

  // Check for changes whenever relevant state updates
  useEffect(() => {
    if (isNew) {
      setHasChanges(true)
      return
    }

    if (!selectedTask || !formRef.current) {
      setHasChanges(false)
      return
    }

    setHasChanges(hasUpdates(selectedTask, formRef.current, selectedStatus, subtasks))
  }, [selectedTask, selectedStatus, subtasks, isNew])

  const handleStatusChange = (value: string) => {
    console.log('[handleStatusChange] ', value)
    setSelectedStatus(value)
  }

  const handleFormChange = () => {
    // Changes will be detected by the useEffect above
  }

  const handleAddNewSubtask = () => {
    setSubtasks(current => [...current, v4()])
  }

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(current => current.filter(st => st !== subtaskId))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) return
    const formData = new FormData(formRef.current)

    const fieldErrors: { [key: string]: string } = {
      title: 'Title is required',
      ...Object.fromEntries(subtasks.map(st => [st, "can't be empty"]))
    }

    const errors = validateForm(formRef.current, fieldErrors)
    if (errors && !!Object.keys(errors).length) {
      setErrors(errors)
      return
    }

    const subt = subtasks.map(subtask => {
      const originalTask: ISubTask = selectedTask?.subtasks.find(st => st.id === subtask) || {} as ISubTask
      return { ...originalTask, name: formData.get(subtask) }
    })

    const title = formData.get('title')
    const description = formData.get('description')

    try {
      let response: AxiosResponse<ITask>
      if (!!selectedTask?.id) {
        response = await kanbanApi.patch(`/tasks/${selectedTask.id}`, { title, description, subtasks: subt, status: selectedStatus })
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
        <TextField
          id="title"
          name="title"
          defaultValue={selectedTask?.title}
          placeholder="e.g. Take coffee break"
          errorMessage={errors["title"]}
          onChange={() => setErrors(current => ({...current, title: ''}))}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <TextArea
          name="description"
          id="description"
          defaultValue={selectedTask?.description}
          className="h-28 resize-none"
          placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
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
              placeholder="e.g. Make coffee"
              defaultValue={selectedTask?.subtasks.find(s => s.id === subTask)?.name}
              errorMessage={errors[subTask]}
              onChange={() => setErrors(current => ({...current, [subTask]: ''}))}
            />
            <span className={baseStyles.closeIcon} onClick={() => handleRemoveSubtask(subTask)}></span>
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

function hasUpdates(
  task: ITask, 
  form: HTMLFormElement, 
  currentStatus?: string, 
  currentSubtasks: string[] = []
): boolean {
  const formData = new FormData(form)

  // Check if basic fields changed
  if (formData.get('title') !== task.title) return true
  if (formData.get('description') !== task.description) return true
  if (currentStatus !== task.status) return true

  // Check if subtask count changed
  if (currentSubtasks.length !== task.subtasks.length) return true

  // Check if any subtask content changed
  return task.subtasks.some(st => {
    const subtaskId = st.id as string
    const formValue = formData.get(subtaskId)
    return formValue !== st.name
  })
}

export default AddNewTaskModal