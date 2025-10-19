export interface ISubTask {
  id?: string
  name: string
  completed: boolean
}

export interface ITask {
  id: string
  title: string
  description: string
  subtasks: ISubTask[]
  status?: string
  assignee?: string
}