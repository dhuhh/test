import React from 'react'
import { Button } from 'antd';
import styles from './index.less'
export default function JButton(props) {
    return (
        <div className={styles.JButton}>
            <Button {...props}>{ props.children }</Button>
        </div>
    )
}
