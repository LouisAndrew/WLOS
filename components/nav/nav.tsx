import React, { FC, useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from 'react-icons/ri'

import { NavLink } from './nav-link'
import { Avatar } from './avatar'
import styles from './nav.module.css'

export type Props = {
  /**
   * sets if the menu / nav should be shown on mobile
   */
  showMenu: boolean
  /**
   * function to close / hide menu on mobile
   */
  closeMenu: () => void
}

const Nav: FC<Props> = ({ closeMenu, showMenu }) => {
  const [shouldShrinkMenu, setShouldShrinkMenu] = useState(false)

  return (
    <nav className={`${styles.container} ${showMenu ? styles.container_show_mobile : ''}`}>
      <div
        className={`${styles.upper_section} ${shouldShrinkMenu ? styles.upper_section_wrap : ''}`}
      >
        <button
          className={`nav-button ${styles.btn} ${styles.close_btn}`}
          data-testid="close-btn"
          onClick={closeMenu}
        >
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
    </nav>
  )
}

export default Nav
