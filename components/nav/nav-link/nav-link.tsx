import React, { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { RiHome2Line, RiBookletLine, RiStickyNoteLine, RiSettingsLine } from 'react-icons/ri'

import styles from './nav-link.module.css'

export type LinkType = 'HOME' | 'LOGS' | 'PLANS' | 'SETTINGS'

export type LinkItem = {
  /**
   * text to be displayed on the link
   */
  text: string
  /**
   * icon to be displayed beside the text
   */
  Icon: IconType
  /**
   * link (go to link when pressed)
   */
  link: string
}

const linkItems: Record<LinkType, LinkItem> = {
  HOME: {
    text: 'HOME',
    Icon: RiHome2Line,
    link: '/',
  },
  PLANS: {
    text: 'PLANS',
    Icon: RiBookletLine,
    link: '/plans',
  },
  LOGS: {
    text: 'LOGS',
    Icon: RiStickyNoteLine,
    link: '/logs',
  },
  SETTINGS: {
    text: 'SETTINGS',
    Icon: RiSettingsLine,
    link: '/settings',
  },
}

export type Props = {
  /**
   * type of the link
   */
  type: LinkType
  /**
   * additional styling
   */
  className?: string
  /**
   * sets if the button content should be shrinked
   */
  shouldShrink?: boolean
}

const NavLink: FC<Props> = ({ type, className, shouldShrink = false }) => {
  const router = useRouter()
  const linkItem = linkItems[type]

  const isActive = router.pathname.includes(linkItem.link)

  return (
    <Link href={linkItem.link}>
      <button
        className={`${styles.container} ${isActive ? styles.container_active : ''} ${className}`}
        type="button"
      >
        <linkItem.Icon className={styles.icon} />
        <span className={`${styles.content} ${shouldShrink ? styles.content_shrinked : ''}`}>
          {linkItem.text}
        </span>
      </button>
    </Link>
  )
}

export default NavLink
