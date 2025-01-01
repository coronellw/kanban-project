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
          [styles.secondary]: btnType === "secondary",
          [styles.destructive]: btnType === "destructive",
          [styles.normal]: btnSize === "large",
          [styles.small]: btnSize === "small",
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