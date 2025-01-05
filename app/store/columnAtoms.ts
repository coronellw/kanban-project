import { atom } from "jotai";
import { selectedBoardAtom } from "./boardAtoms";

export const ColumnsAtom = atom((get) => {
  const board = get(selectedBoardAtom)
  return board?.columns
})