import React, { FC } from 'react'
import { Ri4KLine, RiMoreFill } from 'react-icons/ri'
import Popup from 'reactjs-popup'

import { ListIcon } from './list-icon'
import styles from './list-item.module.css'

export type Props = {
  /**
   * name of the icon to be renderd on list-icon
   */
  iconName?: string
  /**
   * url of the image. For more details see `list-icon` component
   */
  imgUrl?: string
  /**
   * text to be renderd inside the component
   */
  text?: string
  /**
   * color of which the item should be applied
   */
  color: string
  /**
   * component to be rendered if `option` button is clicked
   */
  OptionComponent?: React.FC
  /**
   * function to handle when the element is clicked
   */
  onClickItem?: () => void
}

/**
 * mock get icon name
 * @param _
 */
const getIconName = (_: string) => Ri4KLine

const ListItem: FC<Props> = ({
  color,
  iconName,
  imgUrl,
  text,
  OptionComponent,
  children,
  onClickItem,
}) => {
  // const [renderOption, setRenderOption] = useState(false)

  console.log(children)
  return (
    <div
      data-testid="list-item__wrapper"
      role="button"
      onClick={onClickItem}
      className={styles.wrapper}
    >
      <ListIcon color={color} Icon={iconName ? getIconName(iconName) : undefined} imgUrl={imgUrl} />
      <div className={styles.content}>
        {children || <span className={`body ${styles.content__text}`}>{text}</span>}
      </div>
      {OptionComponent && (
        <Popup
          position="bottom right"
          arrow={false}
          className="popup"
          trigger={
            <button data-testid="menu-button" className={styles['menu-button']}>
              <RiMoreFill />
            </button>
          }
        >
          <OptionComponent />
        </Popup>
      )}
    </div>
  )
}

export default ListItem
