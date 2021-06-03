import React, { FC, useEffect, useState } from 'react'
import classname from 'classnames/bind'

import { useUserData } from '@h/useUserData'
import { Band } from '@t/Band'
import { Metric } from '@t/Metric'

import style from './band-weight-input.module.css'
import { MetricInput } from '../metric-input'
const cx = classname.bind(style)

export type Props = {
  /**
   * Sets if the input is editable
   */
  isEditable?: boolean
  /**
   * Default value of the weight.
   */
  defaultWeightValue?: number
  /**
   * Handler function to handle change.
   */
  onChange?: (value: number) => void
}

const SEPARATOR = '000'
const EMPTY_VALUE = -1

export const getBands = (value: number, bands: Band[]) => {
  if (value === EMPTY_VALUE) {
    return []
  }

  const str = value.toString().split(SEPARATOR)[0]
  return bands.filter((band) => str.split('').includes(band.id.toString()))
}

export const getAdditionalWeight = (value: number) => {
  if (value === EMPTY_VALUE) {
    return EMPTY_VALUE
  }

  const arr = value.toString().split(SEPARATOR)
  if (arr.length < 2) {
    return EMPTY_VALUE
  }

  return parseFloat(arr[1])
}

const getChangeValue = (bandValue: number, additionalWeight: number) =>
  parseFloat(`${bandValue}${SEPARATOR}${additionalWeight}`)

// todo: how to store band_kg weight values?
// -> BAND: 123 = band1, band2, band3
// -> BAND_KG: 1200012.5 = band1, band2 + 12.5 kg
const BandWeightInput: FC<Props> = ({ defaultWeightValue, onChange }) => {
  const { getUserBands } = useUserData()
  const bands = getUserBands()

  const [selectedBands, setSelectedBands] = useState<Band[]>(
    getBands(defaultWeightValue || EMPTY_VALUE, bands)
  )
  const [additionalWeight, setAdditionalWeight] = useState<number>(
    getAdditionalWeight(defaultWeightValue || EMPTY_VALUE)
  )

  const handleChangeBand = (band: Band) => {
    const index = selectedBands.indexOf(band)
    if (index > -1) {
      setSelectedBands(selectedBands.filter((_, i) => i !== index))
      return
    }

    setSelectedBands([...selectedBands, band])
  }

  useEffect(() => {
    const bandValue = parseInt(
      selectedBands.length > 0
        ? selectedBands.map((b) => b.id.toString()).reduce((a, b) => a + b, '')
        : '0'
    )

    if (additionalWeight === EMPTY_VALUE) {
      onChange?.(bandValue)
      return
    }

    onChange?.(
      selectedBands.length === 0 ? EMPTY_VALUE : getChangeValue(bandValue, additionalWeight)
    )
  }, [selectedBands, additionalWeight])

  return (
    <div data-testid="band-weight-input-wrapper" className={style.wrapper}>
      <h3>BANDS</h3>
      <div className={style['band-input-wrapper']}>
        {bands.map((band) => {
          const id = `${band.id}-band-select`
          const checked = selectedBands.includes(band)
          const labelClassName = cx({
            'band-input-label': true,
            checked,
          })
          return (
            <label
              key={id}
              htmlFor={id}
              className={labelClassName}
              style={{ backgroundColor: band.color }}
            >
              <input
                type="checkbox"
                aria-label={id}
                id={id}
                className={style['band-input']}
                checked={checked}
                onClick={() => handleChangeBand(band)}
                onSelect={() => handleChangeBand(band)}
                onChange={() => handleChangeBand(band)}
              />
              <div className={style['band-input-marker']} />
            </label>
          )
        })}
      </div>
      <div className={style['weight-wrapper']}>
        <label htmlFor="band-weight-input" className="col-span-full row-span-1">
          Additional Weight
        </label>
        <input
          onChange={(e) => {
            const val = e.target.value
            const validator = ['', '0']
            if (validator.includes(val)) {
              setAdditionalWeight(EMPTY_VALUE)
              return
            }

            const parsed = parseFloat(val)
            if (parsed <= 0) {
              setAdditionalWeight(EMPTY_VALUE)
              return
            }

            setAdditionalWeight(parseFloat(val))
          }}
          value={additionalWeight === EMPTY_VALUE ? '' : additionalWeight}
          disabled={selectedBands.length === 0}
          className={style['weight-input']}
          type="number"
          placeholder="##"
          id="band-weight-input"
        />
        <MetricInput isEditable={false} defaultMetric={Metric.KG} />
      </div>
    </div>
  )
}

export default BandWeightInput
