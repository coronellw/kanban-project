import Button from "~/ui/button"
import styles from "./confirm-box.module.css"
import classNames from "classnames"

type ConfirmBoxProps = {
  onConfirm?: (args: any) => void
  onDeny?: (args: any) => void
  confirmText?: string
  denyText?: string
} & React.ComponentPropsWithoutRef<'div'>

const ConfirmBox = ({ children, className, onConfirm, onDeny, confirmText = "Yes", denyText = "No" }: ConfirmBoxProps) => {
  return (
    <div className={classNames(styles.confirmBox, className)}>
      {children}
      <span className={styles.cta}>
        <Button className="flex flex-1" btnType="destructive" onClick={onConfirm}>{confirmText}</Button>
        <Button className="flex flex-1" btnType="secondary" onClick={onDeny}>{denyText}</Button>
      </span>
    </div>
  )
}

export default ConfirmBox