import styles from "./visibility-toggle.module.css"

const Visibility = () => {
  return <div className={styles.wrapper}>
    <span className={styles["icon-eye-closed"]}></span>
    Hide Sidebar
    </div>
}

export default Visibility