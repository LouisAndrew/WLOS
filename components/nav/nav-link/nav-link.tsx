import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { RiHome2Line, RiBookletLine, RiStickyNoteLine } from 'react-icons/ri'
import { Button } from 'antd'

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

  return (
    <Button onClick={() => router.push(linkItem.link)}>
      <linkItem.Icon />
      {linkItem.text}
    </Button>
  )
}

export default NavLink
