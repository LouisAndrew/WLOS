import { render, cleanup, fireEvent } from '@testing-library/react'
import ReviewSelect, { Props } from '@c/input/set-input/review-select/review-select'
import { Review } from '@t/Review'
import { startCase } from 'lodash'

afterEach(cleanup)

const component = (args: Partial<Props> = {}) => render(<ReviewSelect {...args} />)

describe('Review Select component', () => {
  it.each(Object.values(Review).map((r) => [r]))(
    'Renders all of the available review selection',
    (review) => {
      const { queryByLabelText: l } = component()
      expect(l(startCase(review))).toBeInTheDocument()
      expect((l(startCase(review)) as HTMLInputElement).checked).toBeFalsy()
    }
  )

  it('Displays the selected review if `defaultReview` is provided', () => {
    const value = Review.UP
    const { getByLabelText: l } = component({ defaultReview: value })
    expect((l(startCase(value)) as HTMLInputElement).checked).toBeTruthy()
  })

  it.each(Object.values(Review).map((r) => [r]))(
    'Calls `onChange` method and set the select input as selected if a review item is clicked',
    (review) => {
      const onChange = jest.fn()
      const { getByLabelText: l } = component({ defaultReview: review, onChange })
      const input = l(startCase(review))

      fireEvent.click(input)
      expect(onChange).toBeCalled()
      expect(onChange).toBeCalledWith(review)
      expect((input as HTMLInputElement).checked).toBeTruthy()
    }
  )
})
