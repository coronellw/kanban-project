export interface IBoard {
  _id: string
  name: string
  columns: Array<IColumn>
  owner?: string
}

export interface IColumn {
  name: string
  _id: string
  color?:string
}