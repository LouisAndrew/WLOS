import React from 'react'
import { Story } from '@storybook/react'

import ReviewSelect, { Props } from '@c/input/set-input/review-select/review-select'
import { Review } from '@t/Review'

export default {
  title: 'Components/Input/Set input/Review select',
  component: ReviewSelect,
}

const Template: Story<Props> = (args) => <ReviewSelect {...args} />

export const Default = Template.bind({})
export const Selected = Template.bind({})
Selected.args = {
  defaultReview: Review.UP,
}
