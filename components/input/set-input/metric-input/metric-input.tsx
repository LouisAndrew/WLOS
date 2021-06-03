import React, { FC, useState } from 'react'
import { Popup } from 'reactjs-popup'
import classname from 'classnames/bind'
import { useUserData } from '@h/useUserData'
import { Metric } from '@t/Metric'

import styles from './metric-input.module.css'

const cx = classname.bind(styles)

export type Props = {
  /**
   * Default value of the metric
   */
  defaultMetric?: Metric
  /**
   * Sets if the input is editable
   */
  isEditable?: boolean
  /**
   * Custom tailwind styling
   */
  className?: string
  /**
   * Handler function if the value is changed.
   */
  onChange?: (metric: Metric) => void
}

const MetricInput: FC<Props> = ({ defaultMetric, isEditable, className, onChange }) => {
  const { getUserBands } = useUserData()
  const couldSelectBanded = getUserBands().length > 0
  const renderMetricText = (m: Metric, renderText: boolean = false) =>
    m === Metric.TIME && renderText ? 's' : m.replace('_', ' + ')

  return (
    <Popup
      trigger={
        <button
          className={`${styles.wrapper} ${className}`}
          data-testid="metric-input-wrapper"
          data-editable={isEditable}
        >
          {renderMetricText(defaultMetric || Metric.KG, true)}
        </button>
      }
      disabled={!isEditable}
      arrow={false}
      position="bottom right"
      offsetY={8}
    >
      <ul data-testid="metric-input-select-list" className={styles['metric-select']}>
        {Object.values(Metric).map((metric) => {
          if (!couldSelectBanded && [Metric.BAND, Metric.BAND_KG].includes(metric)) {
            return null
          }

          if (metric === Metric.BAND_KG) {
            return null
          }

          const className = cx({
            'metric-select-item': true,
            selected: metric === (defaultMetric || Metric.KG),
          })

          return (
            <li
              className={className}
              key={metric}
              data-testid={metric}
              role="button"
              onClick={() => onChange(metric)}
            >
              {renderMetricText(metric)}
            </li>
          )
        })}
      </ul>
    </Popup>
  )
}

export default MetricInput
