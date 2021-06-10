import React from 'react'
import { Story } from '@storybook/react'

import LogListItem, { Props } from '@c/list/log-list/log-list-item/log-list-item'
import { mockModel, mockModelWithId } from '@/mock/exercise'
import { mockExerciseSet } from '@/mock/exercise-set'

export default {
  title: 'Components/List/Log list/Log list item',
  component: LogListItem,
}

const Template: Story<Props> = (args) => <LogListItem onChange={(e) => console.log(e)} {...args} />

export const Default = Template.bind({})
Default.args = {
  exerciseSets: [],
  exerciseModel: mockModel,
}
export const Filled = Template.bind({})
Filled.args = {
  exerciseModel: mockModelWithId,
  exerciseSets: [mockExerciseSet],
  isEditable: true,
  isLoggable: true,
  comparisonSets: [
    { ...mockExerciseSet, weight: 20 },
    { ...mockExerciseSet, weight: 12, setNumber: 2 },
    { ...mockExerciseSet, weight: 20, setNumber: 3 },
    { ...mockExerciseSet, weight: 12, setNumber: 4 },
  ],
}
