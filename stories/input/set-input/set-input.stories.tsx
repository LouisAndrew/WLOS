import React from 'react'
import { Story } from '@storybook/react'

import SetInput, { Props } from '@c/input/set-input/set-input'
import { mockExerciseSet } from '@/mock/exercise-set'
import { Metric } from '@t/Metric'

export default {
  title: 'Components/Input/Set input',
  component: SetInput,
}

const Template: Story<Props> = (args) => <SetInput isEditable {...args} />

export const Default = Template.bind({})
Default.args = {
  setNumber: 1,
}

const args = {
  setNumber: 1,
  inputIds: '',
  defaultRepsCount: mockExerciseSet.repsCount,
  defaultWeightValue: mockExerciseSet.weightValue,
  defaultMetric: mockExerciseSet.weightMetric,
  defaultReview: mockExerciseSet.review,
  isEditable: true,
  onSetChange: (e) => console.log(e),
}

export const Filled = Template.bind({})
Filled.args = {
  ...args,
}

export const FilledBand = Template.bind({})
FilledBand.args = {
  ...args,
  defaultMetric: Metric.BAND,
  defaultWeightValue: 12,
}
