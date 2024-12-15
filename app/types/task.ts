interface ISubTask {
  name: string
  completed: boolean
}

interface ITask {
  title: string
  description: string
  subtasks: ISubTask[]
  status?: string
  assignee?: string
}