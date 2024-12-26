import styles from "./dotted-menu.module.css"


const DottedMenu = (props: React.ComponentPropsWithoutRef<'span'>) => {
  return <span className={styles.dots} {...props}></span>
}

export default DottedMenu