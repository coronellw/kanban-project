import type { ITask } from "./task"
import type { IBoard } from "./board"

export interface IUser {
  id: string
  name: string
  email: string
  tasks?: ITask[]
  boards?: IBoard[]
}