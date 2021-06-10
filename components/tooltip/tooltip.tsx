import React, { FC } from 'react'
import Popup from 'reactjs-popup'
import { PopupPosition } from 'reactjs-popup/dist/types'

export type Props = {
  /**
   * Trigger component.
   * @see reactjs-popup
   */
  trigger: JSX.Element | ((isOpen: boolean) => JSX.Element)
  /**
   * Content to be displayed in the popup
   */
  content: string
  /**
   * Position of the tooltip.
   */
  position?: PopupPosition
}

const Tooltip: FC<Props> = ({ trigger, content, position = 'right center' }) => {
  return (
    <Popup
      trigger={trigger}
      arrow={false}
      on="hover"
      position={position}
      className="tooltip"
      offsetX={8}
      mouseEnterDelay={900}
    >
      <figcaption style={{ fontWeight: 'bold' }}>{content}</figcaption>
    </Popup>
  )
}

export default Tooltip
