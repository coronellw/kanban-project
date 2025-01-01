import * as RadixCheckbox from "@radix-ui/react-checkbox"
import styles from "./checkbox.module.css"
import classNames from "classnames"
import { useState } from "react"
import { v4 } from "uuid"

type checkboxProps = {
  handleChange: () => void
} & React.ComponentPropsWithoutRef<'input'>

const Checkbox = ({ children, className, checked, handleChange }: checkboxProps) => {
  const [id] = useState(v4())

  return <div className={classNames(styles.checkbox, className)} onClick={handleChange}>
    <RadixCheckbox.Root checked={checked} className={styles.checkboxRoot} id={id}>
      <RadixCheckbox.Indicator>
        {checked && <span className={styles.indicator}></span>}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
    <label className={styles.label} onClick={handleChange} htmlFor={id}>{children}</label>
  </div>
}

export default Checkbox