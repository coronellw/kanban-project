import type React from "react"
import styles from "./button.module.css"
import classNames from "classnames"

type Button = {
  btnSize?: "large" | "small"
  btnType?: "primary" | "secondary" | "destructive"
} & React.ComponentPropsWithoutRef<'button'>

const Button = ({ children, disabled, className, btnType = "primary", btnSize = "large", ...props }: Button) => {

  return (
    <button
      className={classNames(
        className,
        {
          [styles.primary]: btnType === "primary",
          [styles.secondary]: !disabled && btnType === "secondary",
          [styles.destructive]: !disabled && btnType === "destructive",
          [styles.normal]: !disabled && btnSize === "large",
          [styles.small]: !disabled && btnSize === "small",
          // [styles.disabled]: disabled,
        },
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button >
  )
}

export default Button