export interface ISubTask {
  _id?: string
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