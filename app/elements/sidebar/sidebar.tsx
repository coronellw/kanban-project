import { useAtomValue } from "jotai"
import boardIcon from "~/assets/icon-board.svg"
import { boardsAtom } from "~/store"

const Sidebar = () => {
  const boards = useAtomValue(boardsAtom)
  return (
    <aside className="min-h-screen min-w-[300px]">
      <nav>
        <h3>All Boards ({boards.length})</h3>
        <ul>
          {boards.map(b =>
            <li key={b._id} className="flex items-center gap-4">
              <img src={boardIcon} alt="Board Icon" />
              <span>
                {b.name}
              </span>
            </li>
          )}
          <li className="flex items-center gap-4 text-primary">
            <img src={boardIcon} alt="Board Icon" />
            <span>
              + Create New Board
            </span>
          </li>
        </ul>
      </nav>

    </aside>
  )
}

export default Sidebar