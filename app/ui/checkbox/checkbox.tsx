import * as RadixCheckbox from "@radix-ui/react-checkbox"
import styles from "./checkbox.module.css"
import classNames from "classnames"

type checkboxProps = {
  handleChange?: () => void,
} & React.ComponentPropsWithoutRef<'input'>

const Checkbox = ({ children, className, checked, handleChange, defaultChecked, id, name }: checkboxProps) => {

  return <div className={classNames(styles.checkbox, className)} >
    <RadixCheckbox.Root
      id={id}
      name={name}
      checked={checked}
      className={styles.checkboxRoot}
      defaultChecked={defaultChecked}
      onCheckedChange={handleChange}
    >
      <RadixCheckbox.Indicator>
        <span className={styles.indicator}></span>
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
    <label className={styles.checkboxLabel} htmlFor={id}>{children}</label>
  </div>
}

export default Checkbox