import * as RadixSelect from "@radix-ui/react-select"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons"
import styles from "./select.module.css"
import React from "react"
import classNames from "classnames"

type SelectProps = {
  placeholder?: string
  handleOptionChange?: (value: string) => void
  options?: Array<{ value: string, label: string }>
} & React.ComponentPropsWithoutRef<'select'>

const Select = ({ options = [], className, value, handleOptionChange, placeholder="Please make a choice", name }: SelectProps) => {
  return (
    <RadixSelect.Root value={value as string} onValueChange={handleOptionChange} name={name} >
      <RadixSelect.Trigger className={classNames(className, styles.trigger)}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className={styles.content} position="popper" sideOffset={8}>
          <RadixSelect.ScrollUpButton className={styles.ScrollButton}>
            <ChevronUpIcon />
          </RadixSelect.ScrollUpButton>

          <RadixSelect.Viewport>
            {options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </RadixSelect.Viewport>

          <RadixSelect.ScrollDownButton className={styles.ScrollButton}>
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

const SelectItem = React.forwardRef<HTMLDivElement, RadixSelect.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <RadixSelect.Item
        className={classNames(styles.item, className)}
        {...props}
        ref={forwardedRef}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className={styles.ItemIndicator}>
          <CheckIcon />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  },
);

export default Select