import React, { FC, useEffect, useState } from 'react'
import { startCase } from 'lodash'
import { RiEmotionNormalFill, RiQuestionFill, RiThumbDownFill, RiThumbUpFill } from 'react-icons/ri'
import { IconType } from 'react-icons/lib'

import classname from 'classnames/bind'

import { Review } from '@t/Review'

import style from './review-select.module.css'

const cx = classname.bind(style)

export type Props = {
  /**
   * Id for the input element.
   */
  inputIds?: string
  /**
   * Default value of the review.
   */
  defaultReview?: Review
  /**
   * Sets if review is editable
   */
  isEditable?: boolean
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

const ReviewSelect: FC<Props> = ({ inputIds = 'ID', onChange, defaultReview, isEditable }) => {
  const [review, setReview] = useState<Review | undefined>(defaultReview)

  useEffect(() => {
    onChange?.(review)
  }, [review])

  const defaultIconClass = cx({
    'input-icon': true,
    'default-icon': true,
  })

  return (
    <div data-testid="review-select-wrapper" className={style.wrapper} data-editable={isEditable}>
      {!review && <RiQuestionFill className={defaultIconClass} />}
      {Object.values(Review).map((r) => {
        const Icon = InputIcons[r]

        const labelClassName = cx({
          'input-label': true,
          active: r === review,
        })

        const id = `${inputIds}_${r}`

        return (
          <label htmlFor={id} className={labelClassName} key={id}>
            <input
              aria-label={startCase(r)}
              type="radio"
              id={id}
              checked={r === review}
              onClick={() => setReview(r)}
              onSelect={() => setReview(r)}
              onChange={() => setReview(r)}
              name={`${inputIds}__review-select`}
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
