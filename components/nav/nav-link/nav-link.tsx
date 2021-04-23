import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { RiHome2Line, RiBookletLine, RiStickyNoteLine } from 'react-icons/ri'
import { Space } from 'antd'

import styles from './style.module.css'

export type LinkType = 'HOME' | 'LOGS' | 'PLANS'

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
}

export type Props = {
  /**
   * type of the link
   */
  type: LinkType
}
const NavLink: FC<Props> = ({ type }) => {
  const router = useRouter()
  const linkItem = linkItems[type]

  // const isActive = router.pathname.includes(linkItem.link)

  return (
    <button className={`${styles.container}`} type="button">
      <Space size="middle" align="center">
        <linkItem.Icon className={styles.icon} />
        {linkItem.text}
      </Space>
    </button>
  )
}

export default NavLink
