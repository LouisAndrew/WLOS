import React from 'react'
import { Story } from '@storybook/react'

import SavedExerciseList, { Props } from '@c/list/saved-exercise-list/saved-exercise-list'

export default {
  title: 'Components/List/Saved exercise list',
  component: SavedExerciseList,
}

const Template: Story<Props> = (args) => (
  <SavedExerciseList onSelect={(e) => console.log(e)} {...args} />
)

export const Default = Template.bind({})
