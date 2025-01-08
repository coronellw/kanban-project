import * as Popover from "@radix-ui/react-popover"
import classNames from "classnames"

import styles from "./pop-over-menu.module.css"

type PopOverMenuProps = { trigger: React.ReactNode } & React.ComponentPropsWithoutRef<'div'>

export const PopOverMenu = ({ children, trigger, className }: PopOverMenuProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {trigger}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={classNames(styles.content, className)}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default PopOverMenu