import classNames from "classnames"
import { v4 } from "uuid"
import styles from "./checkbox.module.css"
import React, { useState, type SyntheticEvent } from "react"

type checkboxProps = {
  handleChange: (themeState: React.ChangeEvent<HTMLInputElement>) => void
} & React.ComponentPropsWithoutRef<'input'>

const Checkbox = ({ handleChange, checked = false }: checkboxProps) => {
  const [id] = useState(v4())

  return (
    <span className={styles.wrapper}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={classNames(styles.toggle, [styles["toggle-ios"]])}
      />
      <label htmlFor={id} className={styles["toggle-btn"]} />
    </span>
  )
}

export default Checkbox