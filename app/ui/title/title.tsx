import styles from "./title.module.css"

type TitleProps = {
    title: string
    action?: VoidFunction
}

const Title = ({title, action}: TitleProps) => {
    return (
        <span className={styles.title}>
            {title}
            <span className={styles.caret} onClick={action} />
        </span>
    )
}

export default Title