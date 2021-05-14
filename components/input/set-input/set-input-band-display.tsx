import React, { FC } from 'react'
import { RiAddFill } from 'react-icons/ri'

import { useUserData } from '@h/useUserData'

import style from './set-input.module.css'
import { getAdditionalWeight, getBands } from './band-weight-input'

export type Props = {
  /**
   * Value that should be displayed
   */
  weightValue: number
}

const SetInputBandDisplay: FC<Props> = ({ weightValue }) => {
  const { getUserBands } = useUserData()
  const bands = getBands(weightValue, getUserBands())
  const additionalWeight = getAdditionalWeight(weightValue)
  return (
    <div className={style['band-input-wrapper']}>
      <div className={style['band-display-wrapper']}>
        {bands.map((band) => (
          <div
            className={style['band-display-item']}
            style={{ backgroundColor: band.color }}
            key={`${band.id}-display`}
          />
        ))}
        {bands.length === 0 && (
          <div className={`bg-primary-gray ${style['band-display-item']}`}>
            <RiAddFill />
          </div>
        )}
      </div>
      {additionalWeight !== -1 && (
        <div className={style['additional-display-wrapper']}>+ {additionalWeight}</div>
      )}
    </div>
  )
}

export default SetInputBandDisplay
