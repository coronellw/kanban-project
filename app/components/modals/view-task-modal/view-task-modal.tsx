import { useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"

import { activeModalAtom, ColumnsAtom, selectedTaskAtom } from "~/store"
import { capitalize } from "~/utils"
import { useBoard } from "~/hooks/useBoard"

import Button from "~/ui/button"
import Select from "~/ui/select"
import Checkbox from "~/ui/checkbox"
import { TaskMenu } from "~/elements/pop-over-menus"

import styles from "./view-task-modal.module.css"
import baseStyles from "../base-modal.module.css"

export const ViewTaskModal = () => {
  const task = useAtomValue(selectedTaskAtom)
  const columns = useAtomValue(ColumnsAtom)
  const setModal = useSetAtom(activeModalAtom)
  const [states] = useState(columns?.map(c => ({ value: c._id, label: capitalize(c.name) })))
  const { toggleSubTaskCompletion } = useBoard()

  if (!task) {
    return (
      <div className="flex flex-col">
        <span className="text-heading-xl">No task selected, try to choose a different one!</span>
        <Button btnType="destructive" onClick={() => setModal(0)}>Ok</Button>
      </div>
    )
  }

  const toggleSubTask = async (subtaskId: string) => {
    try {
      toggleSubTaskCompletion(task, subtaskId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form className={baseStyles.baseModal}>
      <span className="flex justify-between items-center">
        <span className="text-heading-l">{task.title}</span>
        <TaskMenu />
      </span>
      <span className="text-body-l">{task.description}</span>
      <span className="text-body-m">
        Subtasks ({task.subtasks?.filter(t => t.completed)?.length} of {task.subtasks?.length})
      </span>
      <span className="flex flex-col gap-2">
        {task.subtasks.map(subtask => {
          return <Checkbox
            id={subtask._id}
            name={subtask._id}
            key={subtask._id}
            defaultChecked={subtask.completed}
            handleChange={() => toggleSubTask(subtask._id as string)}
          >{subtask.name}</Checkbox>
        })}
      </span>
      <div className="flex flex-col gap-2">
        <span className={styles.label}>Status</span>
        <Select
          disabled
          id="status"
          name="status"
          options={states}
          value={task.status}
        />
      </div>
    </form>
  )
}

export default ViewTaskModal