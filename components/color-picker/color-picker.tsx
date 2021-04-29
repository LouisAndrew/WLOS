import React, { FC, useEffect, useState } from 'react'
import classname from 'classnames/bind'
import { colorTable } from './base-colors'

import styles from './color-picker.module.css'

const cx = classname.bind(styles)

export type Props = {
  /**
   * default selected color
   */
  defaultSelected?: string
  /**
   * function to handle when a color button is clicked or when the custom color input is filled
   */
  onColorChange: (colorCode: string) => void
}

const ColorPicker: FC<Props> = ({ defaultSelected, onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState(defaultSelected || '')

  const isColorCustomed =
    colorTable.findIndex(([_, colorCode]) => colorCode === selectedColor) === -1

  const handleChangeCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value[0] === '#' || value === '') {
      setSelectedColor(value)
    }
  }

  useEffect(() => {
    onColorChange(selectedColor)
  }, [selectedColor])

  const customColorPreviewClass = cx({
    'custom-color__preview': true,
    'is-customed': isColorCustomed,
  })

  return (
    <div className={styles.container} data-testid="wrapper">
      <h3>Colors</h3>
      <div className={styles['color-selector-wrapper']}>
        {colorTable.map(([colorName, colorCode]) => {
          const isColorActive = selectedColor === colorCode
          const colorId = `color-selector-${colorName}`
          const colorSelectorClass = cx({
            'color-selector': true,
            'is-active': isColorActive,
          })
          return (
            <button
              data-testid={colorId}
              key={colorId}
              style={{ backgroundColor: colorCode }}
              className={colorSelectorClass}
              onClick={() => setSelectedColor(colorCode)}
            >
              {isColorActive && <div className={styles['color-selector__active-marker']} />}
            </button>
          )
        })}
      </div>
      <label htmlFor="custom-color">
        Custom color
        <div>
          <div
            data-testid="custom-color-preview"
            className={customColorPreviewClass}
            style={{ backgroundColor: isColorCustomed ? selectedColor : 'transparent' }}
          />
          <input type="text" id="custom-color" onChange={handleChangeCustomColor} />
        </div>
      </label>
    </div>
  )
}

export default ColorPicker
