import classNames from "classnames"
import { v4 } from "uuid"
import styles from "./toggle.module.css"
import React, { useState } from "react"

type toggleProps = {
  handleChange: (themeState: React.ChangeEvent<HTMLInputElement>) => void
} & React.ComponentPropsWithoutRef<'input'>

const Toggle = ({ handleChange, checked = false }: toggleProps) => {
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

export default Toggle