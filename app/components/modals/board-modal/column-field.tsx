import TextField from "~/ui/text-field"

import baseStyles from "../base-modal.module.css"
import { useMemo, useState } from "react"
import { useBoard } from "~/hooks/useBoard"
import {CheckIcon, Cross1Icon} from "@radix-ui/react-icons"

type ColumnFieldProps = {
  column: string
  onDelete: (columnId: string) => void
  onConfirm?: (args: any) => void
}

const ColumnField = ({ column, onDelete }: ColumnFieldProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { findColumn } = useBoard()
  const currentColumn = useMemo(()=> findColumn(column), [column])
  const hasTasks = currentColumn?.tasks.length || 0 > 0
  const handleClick = () => {
    if (hasTasks) {
      setShowConfirmation(true)
      return
    }
    onDelete(column)
  }

  return (
    showConfirmation ?
      <div className="flex justify-between py-2 px-4 border rounded-lg bg-yellow-200/50 border-yellow-400">
        <span className="text-heading-s">
          This action also deletes {currentColumn?.tasks.length} tasks and is irreversible.
        </span>
        <span className="flex gap-2">
          <span title="continue" onClick={() => onDelete(column)}><CheckIcon className="hover:text-green-500 cursor-pointer" /></span>
          <span title="cancel" onClick={() => setShowConfirmation(false)}><Cross1Icon className="hover:text-secondary cursor-pointer" /></span>
        </span>
      </div>
      : <div className="flex items-center gap-4">
        <TextField
          className="flex-1"
          name={column}
          id={column}
          defaultValue={currentColumn?.name}
        />
        <span className={baseStyles.closeIcon} onClick={handleClick}></span>
      </div>
  )
}

export default ColumnField