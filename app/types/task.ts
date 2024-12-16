export interface ISubTask {
  name: string
  completed: boolean
}

export interface ITask {
  title: string
  description: string
  subtasks: ISubTask[]
  status?: string
  assignee?: string
}