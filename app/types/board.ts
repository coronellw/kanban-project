export interface IBoard {
  _id: string
  name: string
  columns: Array<{name: string, _id: string, color?:string}>
  owner?: string
}