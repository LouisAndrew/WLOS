import React, { FC } from 'react'
import Popup from 'reactjs-popup'

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
}

const Tooltip: FC<Props> = ({ trigger, content }) => {
  return (
    <Popup
      trigger={trigger}
      arrow={false}
      on="hover"
      position="right center"
      className="tooltip"
      offsetX={8}
      mouseEnterDelay={900}
    >
      <figcaption>{content}</figcaption>
    </Popup>
  )
}

export default Tooltip
