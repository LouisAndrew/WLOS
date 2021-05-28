import React, { FC } from 'react'
import { IconType } from 'react-icons'
import classname from 'classnames/bind'

import style from './modal.module.css'

const cx = classname.bind(style)

export type Props = {
  /**
   * Text to be shown on modal's header section
   */
  headerText: string
  /**
   * Text to be displayed on modal's body section
   */
  bodyText?: string
  /**
   * Text to be displayed on the primary button.
   */
  primaryButtonText?: string | React.Component
  /**
   * Text to be displayed on the secondary button.
   */
  secondaryButtonText?: string | React.Component
  /**
   * Handler function to be called when user clicks on the primary button
   */
  onPrimaryClicked?: () => void
  /**
   * Handler function to be called when user clicks on the secondary button
   */
  onSecondaryClicked?: () => void
  /**
   * custom class names for styling
   */
  className?: string
  /**
   * Icon to be displayed within the modal
   */
  Icon?: IconType
  /**
   * Fill color for the icon
   */
  iconFill?: 'yellow' | 'red' | 'white'
}

const Modal: FC<Props> = ({
  headerText,
  bodyText,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClicked,
  onSecondaryClicked,
  className,
  Icon,
  iconFill,
}) => {
  const renderButtons = onPrimaryClicked || onSecondaryClicked

  return (
    <div data-testid="modal-wrapper" className={`${style.wrapper} ${className}`}>
      <Icon className={cx({ icon: true, [iconFill || 'white']: true })} />
      <h3 className="heading text-xl tracking-widest">{headerText}</h3>
      {bodyText && <p className="font-body text-sm text-muted">{bodyText}</p>}
      {renderButtons && (
        <div className={style['button-group']}>
          {onSecondaryClicked && (
            <button
              onClick={onSecondaryClicked}
              className={`btn btn--s btn--secondary ${cx({
                secondary: true,
                single: !onPrimaryClicked,
              })}`}
              data-buttontype="secondary"
            >
              {secondaryButtonText || 'No'}
            </button>
          )}
          {onPrimaryClicked && (
            <button
              onClick={onPrimaryClicked}
              className={`btn btn--s btn--primary ${cx({
                primary: true,
                single: !onSecondaryClicked,
              })}`}
              data-buttontype="primary"
            >
              {primaryButtonText || 'Yes'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Modal
