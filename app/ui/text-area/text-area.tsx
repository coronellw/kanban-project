import classNames from "classnames"
import styles from "./text-area.module.css"

type TextAreaProps = {errorMessage?: string} & React.ComponentPropsWithoutRef<'textarea'>

const TextArea = ({className, errorMessage, ...props }: TextAreaProps) => {
  return (
    <div className={styles.wrapper}>
      <textarea className={classNames(styles.textArea, className)} {...props}></textarea>
      {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  )
}

export default TextArea