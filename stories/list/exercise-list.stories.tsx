import React from 'react'
import { Story } from '@storybook/react'

import ExerciseList, { Props } from '@c/list/exercise-list/exercise-list'
import { mockModel2, mockModelWithId } from '@/mock/exercise'

const mockExercises = [mockModelWithId, { ...mockModel2, exerciseId: '-1' }]

export default {
  title: 'Components/List/Exercise list',
  component: ExerciseList,
}

const Template: Story<Props> = (args) => <ExerciseList {...args} />

export const Default = Template.bind({})
Default.args = {
  exercises: [],
  isEditable: true,
}

export const Filled = Template.bind({})
Filled.args = {
  exercises: mockExercises,
  isEditable: true,
}
