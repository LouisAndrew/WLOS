import { ColorPicker } from '@c/color-picker'
import { TemplateTable, TemplateTableWithData } from '@t/tables/Template'
import React, { FC, useState } from 'react'
import { IconType } from 'react-icons'
import { RiBallPenLine, RiDeleteBin6Line, RiEyeLine, RiFile3Line } from 'react-icons/ri'
import Popup from 'reactjs-popup'
import style from './view-header.module.css'

export type Props = {
  /**
   * Default value of the current page state
   */
  pageState: PageState

  /**
   * Sets if the template-name is editable
   */
  isEditable?: boolean
  /**
   * Name of the template
   */
  templateName: string
  /**
   * Color code of the template
   */
  templateColorCode: string
  /**
   * Handler function to handle if the page state is changed.
   */
  handleChangePageState: (newState: PageState) => void
  /**
   * Handler function to handle if the template name is changed
   */
  handleChangeTemplateName?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * Handler function to handle if the color is changed.
   */
  handleColorChange?: (colorCode: string) => void
}
export enum PageState {
  VIEW = 'Viewing',
  EDIT = 'Editing',
  DELETE = 'Deleting..',
  CREATE = 'Creating',
}

const PageStateIcon: Record<PageState, IconType> = {
  [PageState.CREATE]: RiFile3Line,
  [PageState.EDIT]: RiBallPenLine,
  [PageState.VIEW]: RiEyeLine,
  [PageState.DELETE]: RiDeleteBin6Line,
}

const ViewHeader: FC<Props> = ({
  pageState,
  templateName,
  templateColorCode,
  isEditable,
  handleChangePageState,
  handleChangeTemplateName,
  handleColorChange,
}) => {
  const Icon = PageStateIcon[pageState]

  return (
    <div data-testid="view-header-wrapper" className={style.header}>
      <Popup
        trigger={
          <button
            className={`btn btn--xs btn--ghost ${style['page-state']}`}
            data-testid="change-state-btn"
          >
            {pageState.toUpperCase()}
            <Icon />
          </button>
        }
        arrow={false}
        offsetY={8}
        position="bottom right"
        disabled={pageState === PageState.CREATE}
      >
        <>
          {Object.keys(PageState)
            .filter((key) => PageState[key] !== pageState && PageState[key] !== PageState.CREATE)
            .map((key) => {
              const value = PageState[key]
              const I = PageStateIcon[value]
              return (
                <button
                  className={`btn btn--ghost btn--s w-full flex items-center ml-0`}
                  onClick={() => handleChangePageState(value)}
                  key={key}
                  data-testid="state-btn"
                  aria-label={`${key.toLowerCase()} template`}
                >
                  <I className="mr-3" />
                  {key.toUpperCase()} TEMPLATE
                </button>
              )
            })}
        </>
      </Popup>
      <div className={style['name-wrapper']}>
        <div
          className={style['color-indicator']}
          style={{ backgroundColor: templateColorCode }}
          data-testid="color-indicator"
          aria-label="Template Color"
        />
        <label className={style['name-input-label']}>
          TEMPLATE NAME
          <input
            type="text"
            placeholder="ENTER NAME"
            value={templateName}
            data-iseditable={isEditable}
            onChange={(e) => handleChangeTemplateName?.(e)}
          />
        </label>
      </div>
      {isEditable && (
        <div className={style['button-group']}>
          <Popup
            arrow={false}
            position="bottom left"
            trigger={
              <button className="btn btn--ghost btn--xs" data-testid="change-color-button">
                CHANGE COLOR
              </button>
            }
            offsetY={8}
          >
            <ColorPicker
              className="w-48"
              onColorChange={handleColorChange}
              defaultSelected={templateColorCode}
            />
          </Popup>
        </div>
      )}
    </div>
  )
}

export default ViewHeader
