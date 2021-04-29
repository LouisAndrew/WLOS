import React, { FC } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import styles from './tag.module.css'

export type Props = {
  /**
   * text to be displayed in the tag
   */
  text: string
  /**
   * color code of the tag
   */
  color: string
  /**
   * sets if the tag is clearable
   */
  isClearable?: boolean
  /**
   * handler function when the clear button is clicked
   */
  onClearTag?: () => void
}

const Tag: FC<Props> = ({ text, color, isClearable, onClearTag }) => {
  return (
    <div data-testid="wrapper" className={styles.wrapper} style={{ backgroundColor: color }}>
      <div className={`group ${styles['content__wrapper']}`}>
        <span className={styles.content} style={{ color }}>
          {text}
        </span>
        {isClearable && (
          <button
            data-testid="clear-button"
            onClick={onClearTag}
            className={` ${styles['clear-button']}`}
          >
            <RiCloseLine fill={color} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Tag
