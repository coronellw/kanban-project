import { atomWithStorage } from "jotai/utils"
import type { IUser } from "~/types"

export const userAtom = atomWithStorage<IUser>("k-user", <IUser>{})