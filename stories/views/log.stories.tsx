import React from 'react'
import { Story } from '@storybook/react'

import Log, { Props } from '@v/log/log'
import { PageState } from '@c/view-header/view-header'
import { filledTemplateTableWithData } from '@/mock/workout-template'
import { defaultWorkoutLog, filledWorkoutLog } from '@/mock/workout-log'

export default {
  title: 'Views/Log',
  component: Log,
}

const Template: Story<Props> = (args) => <Log {...args} />

const defaultArgs = {
  defaultState: PageState.VIEW,
  template: filledTemplateTableWithData,
  workoutLog: defaultWorkoutLog,
}

export const Default = Template.bind({})
Default.args = {
  ...defaultArgs,
}

export const Filled = Template.bind({})
Filled.args = {
  ...defaultArgs,
  workoutLog: filledWorkoutLog,
}

export const FilledEdit = Template.bind({})
FilledEdit.args = {
  ...defaultArgs,
  defaultState: PageState.EDIT,
  workoutLog: filledWorkoutLog,
}
