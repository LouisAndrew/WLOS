import React, { FC, useState } from 'react'
import { RiMenuFill } from 'react-icons/ri'

import { Nav } from '@c/nav'
import styles from './layout.module.css'

export type Props = {}

const Layout: FC<Props> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Nav showMenu={showMenu} closeMenu={() => setShowMenu(false)} />
        <button
          data-testid="menu-btn"
          className={`nav-button ${styles.menu_btn}`}
          onClick={() => setShowMenu(true)}
        >
          <RiMenuFill />
        </button>
      </div>
      {children}
    </div>
  )
}

export default Layout
