import React, { FC, useState } from 'react'

import { NavLink } from './nav-link'
import styles from './styles.module.css'

export type Props = {}

const Nav: FC<Props> = () => {
  const [shouldShrinkMenu, setShouldShrinkMenu] = useState(false)

  return (
    <div className={styles.container}>
      <button onClick={() => setShouldShrinkMenu((prev) => !prev)}>Shrink menu</button>
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
