import type { IColumn } from "~/types"

const TaskColumns = ({ columns }: { columns: Array<IColumn> }) => {
  return (
    <ul className="flex flex-wrap gap-16">
      {columns.map(c => (
        <li
          key={c._id}
          className="bg-purple-500 rounded-full py-2 px-4 border-purple-700 text-white hover:bg-purple-400 cursor-pointer"
        >
          {c.name}
        </li>
      ))}
    </ul>
  )
}

export default TaskColumns