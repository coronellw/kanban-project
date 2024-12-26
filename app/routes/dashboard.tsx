import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"

import { boardsAtom, selectedBoardAtom, userAtom } from "~/store"
import { getLoggedUser } from "~/authentication/user"
import DashboardComponent from "~/components/dashboard"

import type { Route } from "./+types/dashboard"


export async function clientLoader() {
  const user = await getLoggedUser()
  if (!user) {
    throw new Response("No user logged in", { status: 401 })
  }
  return { user }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user: userData } = loaderData
  const [user, setUser] = useAtom(userAtom)
  const boards = useAtomValue(boardsAtom)
  const setBoard = useSetAtom(selectedBoardAtom)

  useEffect(() => {
    setUser(userData)
    if (boards.length) {
      setBoard(boards[0])
    }
  }, [userData, boards, setBoard])

  if (!user) return


  return <DashboardComponent />
}