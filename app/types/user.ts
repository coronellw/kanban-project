import type { ITask } from "./task"
import type { IBoard } from "./board"

export interface IUser {
  _id: string
  name: string
  email: string
  tasks?: ITask[]
  boards?: IBoard[]
}