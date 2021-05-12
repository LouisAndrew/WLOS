import React from 'react'
import { Story } from '@storybook/react'

import ExerciseInput, { Props } from '@c/input/exercise-input/exercise-input'
import { mockModelWithId } from '@/mock/exercise'

export default {
  title: 'Components/Inputs/Exercise Input',
  component: ExerciseInput,
}

const Template: Story<Props> = (args) => (
  <ExerciseInput isEditable={true} onChange={(model) => console.log(model)} {...args} />
)

export const Default = Template.bind({})
export const WithDefaultExercise = Template.bind({})
WithDefaultExercise.args = {
  defaultExercise: mockModelWithId,
}
