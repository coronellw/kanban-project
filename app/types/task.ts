export interface ISubTask {
  name: string
  completed: boolean
}

export interface ITask {
  _id: string
  title: string
  description: string
  subtasks: ISubTask[]
  status?: string
  assignee?: string
}