import React, { FC, useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from 'react-icons/ri'

import { NavLink } from './nav-link'
import { Avatar } from './avatar'
import styles from './nav.module.css'

export type Props = {}

const Nav: FC<Props> = () => {
  const [shouldShrinkMenu, setShouldShrinkMenu] = useState(false)

  return (
    <div className={styles.container}>
      <div
        className={`${styles.upper_section} ${shouldShrinkMenu ? styles.upper_section_wrap : ''}`}
      >
        <button className={`nav-button ${styles.btn} ${styles.close_btn}`}>
          <RiCloseLine />
        </button>
        <Avatar />
        <button
          className={`nav-button ${styles.btn} ${styles.expand_btn}`}
          onClick={() => setShouldShrinkMenu((prev) => !prev)}
          data-testid="shrink-toggle"
        >
          {shouldShrinkMenu ? (
            <RiArrowRightSLine data-testid="right-arrow" />
          ) : (
            <RiArrowLeftSLine data-testid="left-arrow" />
          )}
        </button>
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
