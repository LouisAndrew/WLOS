import React from 'react'
import { Story } from '@storybook/react'

import ExerciseListItem, {
  Props,
} from '@c/list/exercise-list/exercise-list-item/exercise-list-item'
import { MockUserDataProvider } from '@lib/context/UserDataContext'
import { UD } from '@lib/provider/useProvideUserData'
import { mockModelWithId } from '@/mock/exercise'

export default {
  title: 'Components/List/Exercise list/Exercise list item',
  component: ExerciseListItem,
}

const Template: Story<Props & { parentArgs: Partial<UD> }> = ({ parentArgs = {}, ...args }) => (
  <MockUserDataProvider {...parentArgs}>
    <ExerciseListItem onChange={(e) => console.log(e)} isEditable {...args} />
  </MockUserDataProvider>
)

export const Default = Template.bind({})
export const Filled = Template.bind({})
Filled.args = {
  defaultExercise: mockModelWithId,
}
