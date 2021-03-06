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
  /**
   * Additional classname for custom styling.
   */
  className?: string
}

const ColorPicker: FC<Props> = ({ defaultSelected, className, onColorChange }) => {
  const checkIfColorCustomed = (color: string) =>
    colorTable.findIndex(([_, colorCode]) => colorCode === color) === -1

  const [selectedColor, setSelectedColor] = useState(defaultSelected || '')
  const [isColorCustomed, setIsColorCustomed] = useState(checkIfColorCustomed(selectedColor))

  const handleChangeCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length > 7) {
      return
    }

    if (value === '' || value[0] === '#') {
      setSelectedColor(value)
      return
    }

    setSelectedColor(`#${value}`)
  }

  useEffect(() => {
    setIsColorCustomed(checkIfColorCustomed(selectedColor))
    onColorChange(selectedColor)
  }, [selectedColor])

  const customColorPreviewClass = cx({
    'custom-color__preview': true,
    'is-customed': isColorCustomed,
  })

  return (
    <div className={`${styles.container} ${className}`} data-testid="color-picker-wrapper">
      <h3 className="font-body font-medium text-lg">
        <span role="img" className="block">
          🎨{' '}
        </span>
        PICK A COLOR
      </h3>
      <div className={styles['color-selector__wrapper']}>
        {colorTable.map(([colorName, colorCode]) => {
          const isColorActive = selectedColor === colorCode
          const colorId = `color-selector-${colorName}`
          const colorSelectorClass = cx({
            'color-selector': true,
            group: true,
            'is-active': isColorActive,
          })
          const colorSelectorMarkerClass = cx({
            'color-selector__marker': true,
            'is-active': isColorActive,
          })

          return (
            <button
              data-testid={colorId}
              key={colorId}
              style={{ backgroundColor: colorCode }}
              className={colorSelectorClass}
              onClick={() => setSelectedColor(colorCode)}
              aria-label={colorCode}
            >
              <div className={colorSelectorMarkerClass} />
            </button>
          )
        })}
      </div>
      <label htmlFor="custom-color" className="block body mt-5">
        <span className="sr-only">Custom color</span>
        <div
          className={styles['custom-color__input-wrapper']}
          style={{ borderColor: selectedColor }}
        >
          <div
            data-testid="custom-color-preview"
            className={customColorPreviewClass}
            style={{ backgroundColor: selectedColor, borderColor: selectedColor }}
          />
          <span className="w-full">
            <input
              type="text"
              id="custom-color"
              onChange={handleChangeCustomColor}
              placeholder="#"
              value={selectedColor}
              className={styles['custom-color__input']}
            />
          </span>
        </div>
      </label>
    </div>
  )
}

export default ColorPicker
