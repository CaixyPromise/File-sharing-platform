import React from 'react'
import styles from "./index.module.scss"
export default function Loadings() 
{
  return (
    <div className={styles['loading__box']}>
        <div className={styles['loading__plane']}></div>
    </div>
  )
}
