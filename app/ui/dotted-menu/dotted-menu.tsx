import styles from "./dotted-menu.module.css"


const DottedMenu = (props: React.ComponentPropsWithoutRef<'span'>) => {
  return <span className={styles.dottedMenu} {...props}><span className={styles.dots}></span></span>
}

export default DottedMenu