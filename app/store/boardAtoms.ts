import { atom } from "jotai"
import type { IBoard } from "~/types/board"
import { userAtom } from "./userAtoms"
import { kanbanApi } from "~/api"
import type { AxiosResponse } from "axios"

export const boardsAtom = atom<Promise<IBoard[]>>(async (get) => {
  const user = get(userAtom)
  if (!user) {
    return []
  }
  const boardsResponse: AxiosResponse<IBoard[]> = await kanbanApi.get('/boards')
  return boardsResponse.data
})

export const selectedBoardAtom = atom<IBoard | null>(null)