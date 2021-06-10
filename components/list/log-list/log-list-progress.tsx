import React, { FC } from 'react'
import classname from 'classnames/bind'

import style from './log-list.module.css'
import { RiCheckFill } from 'react-icons/ri'

const cx = classname.bind(style)

export type Props = {
  isDone: boolean
}

const LogListProgress: FC<Props> = ({ isDone }) => {
  return (
    <div className={style.log_list_progress} data-isdone={isDone}>
      <div className={cx({ log_list_progress_item: true, is_done: isDone })}>
        <RiCheckFill />
      </div>
      <div className={cx({ log_list_progress_line: true, is_done: isDone })} />
    </div>
  )
}

export default LogListProgress
