import classNames from "classnames"
import styles from "./dotted-menu.module.css"


const DottedMenu = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => {
  return <span className={classNames(styles.dottedMenu, className)} {...props}><span className={styles.dots}></span></span>
}

export default DottedMenu