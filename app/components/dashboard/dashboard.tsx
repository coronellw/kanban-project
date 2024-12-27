import { useAtom, useAtomValue } from "jotai"
import { isSidebarVisibleAtom, selectedBoardAtom } from "~/store"
import EmptyBoard from "./empty-board"


const Dashboard = () => {
  const board = useAtomValue(selectedBoardAtom)
  const [isSidebarVisible, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom)

  if (!board?.columns.length) {
    return <EmptyBoard />
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-full w-5/6 mx-auto">
      <h2 className="text-heading-l">Welcome</h2>
      {board && (
        <ul className="flex flex-wrap gap-16">
          {board.columns.map(c => (
            <li
              key={c._id}
              className="bg-purple-500 rounded-full py-2 px-4 border-purple-700 text-white hover:bg-purple-400 cursor-pointer"
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
      {!isSidebarVisible && <div className="absolute left-0 bottom-8 text-white bg-primary pl-8 pr-4 py-2 rounded-r-full" onClick={() => setIsSidebarVisible(true)}>Open</div>}
    </div>
  )
}

export default Dashboard