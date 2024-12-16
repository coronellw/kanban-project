import { atom } from "jotai"
import type { IUser } from "~/types"

export const userAtom = atom<IUser>()