import { atom } from "jotai"
import { atomWithRefresh } from "jotai/utils"

import { kanbanApi } from "~/api"
import { userAtom } from "./userAtoms"

import type { AxiosResponse } from "axios"
import type { IBoard } from "~/types/board"

export const boardsAtom = atomWithRefresh<Promise<IBoard[]>>(
  async (get) => {
    const user = get(userAtom)
    if (!user) {
      return []
    }
    const boardsResponse: AxiosResponse<IBoard[]> = await kanbanApi.get('/boards')
    return boardsResponse.data
  }
)
export const selectedBoardAtom = atom<IBoard & { version?: number }>()