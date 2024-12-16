export interface IBoard {
  _id: string
  name: string
  columns: Array<string>
  owner?: string
}