import type { ITask } from "./task"

export interface IBoard {
  _id: string
  name: string
  columns: Array<IColumn>
  owner?: string
  version?: number
}

export interface IColumn {
  name: string
  _id: string
  color?:string
  tasks: Array<ITask>
}