import classNames from "classnames"
import styles from "./text-field.module.css"

type TextFieldProps = { errorMessage?: string } & React.ComponentPropsWithoutRef<'input'>

const TextField = ({ className, value, onChange, type = "text", placeholder, errorMessage, ...props }: TextFieldProps) => {
  return (
    <span className={classNames(styles.wrapper, className)}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={styles.textField}
        placeholder={placeholder}
        {...props}
      ></input>
      {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
    </span>
  )
}

export default TextField