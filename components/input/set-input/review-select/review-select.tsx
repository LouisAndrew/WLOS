import React, { FC, useEffect, useState } from 'react'
import { startCase } from 'lodash'
import { RiEmotionNormalFill, RiThumbDownFill, RiThumbUpFill } from 'react-icons/ri'
import { IconType } from 'react-icons/lib'

import classname from 'classnames/bind'

import { Review } from '@t/Review'

import style from './review-select.module.css'

const cx = classname.bind(style)

export type Props = {
  /**
   * Default value of the review.
   */
  defaultReview?: Review
  /**
   * change function to be called when value on the component is called
   */
  onChange?: (review: Review) => void
}

const InputIcons: Record<Review, IconType> = {
  [Review.UP]: RiThumbUpFill,
  [Review.DOWN]: RiThumbDownFill,
  [Review.STAY]: RiEmotionNormalFill,
}

const ReviewSelect: FC<Props> = ({ onChange, defaultReview }) => {
  const [review, setReview] = useState<Review | undefined>(defaultReview)

  useEffect(() => {
    onChange?.(review)
  }, [review])

  return (
    <div data-testid="review-select-wrapper" className={style.wrapper}>
      {Object.values(Review).map((r) => {
        const Icon = InputIcons[r]

        const labelClassName = cx({
          'input-label': true,
          active: r === review,
        })

        return (
          <label htmlFor={r} className={labelClassName}>
            <input
              aria-label={startCase(r)}
              type="radio"
              id={r}
              checked={r === review}
              onClick={() => setReview(r)}
              onSelect={() => setReview(r)}
              name="review-select"
              className={style.input}
            />
            <Icon className={style['input-icon']} />
          </label>
        )
      })}
    </div>
  )
}

export default ReviewSelect
