import React, { FC } from 'react'
import { IconType } from 'react-icons'
import { RiQuestionLine } from 'react-icons/ri'
// import moduleName from 'classnames/bind'

import styles from './list-icon.module.css'

export type Props = {
  // icon?:
  /**
   * react icon component.
   */
  Icon?: IconType | React.FC
  /**
   * image url of the list-item [⚠️ WIP: should be displayen if user adds an image]
   */
  imgUrl?: string
  /**
   * color that should be applied to the icon
   */
  color: string
}

const ListIcon: FC<Props> = ({ color, Icon = RiQuestionLine, imgUrl }) => {
  return (
    <div data-testid="wrapper" className={styles.wrapper} style={{ backgroundColor: color }}>
      <div className={styles['content__wrapper']}>
        {imgUrl ? (
          <img src={imgUrl} alt="List item image" className={styles['content--img']} />
        ) : (
          <Icon role="img" fill={color} className={styles.content} />
        )}
      </div>
    </div>
  )
}

export default ListIcon
