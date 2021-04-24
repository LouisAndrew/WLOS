import React, { FC, useState } from 'react'

import { NavLink } from './nav-link'
import { Avatar } from './avatar'
import styles from './nav.module.css'

export type Props = {}

const Nav: FC<Props> = () => {
  const [shouldShrinkMenu, setShouldShrinkMenu] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.upper_section}>
        <Avatar />
      </div>
      <ul className={styles.link_list}>
        <li>
          <NavLink shouldShrink={shouldShrinkMenu} type="HOME" />
        </li>
        <li>
          <NavLink shouldShrink={shouldShrinkMenu} type="PLANS" />
        </li>
        <li>
          <NavLink shouldShrink={shouldShrinkMenu} type="LOGS" />
        </li>
      </ul>
      <NavLink shouldShrink={shouldShrinkMenu} type="SETTINGS" className={styles.settings_btn} />
    </div>
  )
}

export default Nav
