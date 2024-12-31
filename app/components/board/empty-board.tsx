import Button from "~/ui/button"
import styles from "./board.module.css"

const EmptyBoard = () => {
  return <div className="emptyBoard">
    <p className="text-heading-l text-center">This board is empty. Create a new column to get started</p>
    <Button className="self-center">+ Add New Column</Button>
  </div>
}

export default EmptyBoard