import React from 'react'
import { Story } from '@storybook/react'

import ExerciseInput, { Props } from '@c/input/exercise-input/exercise-input'

export default {
  title: 'Components/Inputs/Exercise Input',
  component: ExerciseInput,
}

const Template: Story<Props> = (args) => <ExerciseInput {...args} />

export const Default = Template.bind({})
