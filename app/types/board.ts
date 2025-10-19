import type { ITask } from "./task"

export interface IBoard {
  id: string
  name: string
  columns: Array<IColumn>
  owner?: string
  version?: number
}

export interface IColumn {
  name: string
  id: string
  color?:string
  tasks: Array<ITask>
  board: string
}