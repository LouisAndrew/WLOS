import React from 'react'
import { Story } from '@storybook/react'

import LogList, { Props } from '@c/list/log-list/log-list'
import { defaultTemplateTableWithData, filledTemplateTableWithData } from '@/mock/workout-template'
import { defaultWorkoutLog, filledWorkoutLog } from '@/mock/workout-log'

export default {
  title: 'Components/List/Log list',
  component: LogList,
}

const Template: Story<Props> = (args) => <LogList {...args} />

const defaultArgs = {
  isEditable: true,
  template: defaultTemplateTableWithData,
  workoutLog: defaultWorkoutLog,
}

export const Default = Template.bind({})
Default.args = {
  ...defaultArgs,
}

export const FilledTemplate = Template.bind({})
FilledTemplate.args = {
  ...defaultArgs,
  template: filledTemplateTableWithData,
}

export const FilledLogs = Template.bind({})
FilledLogs.args = {
  ...defaultArgs,
  workoutLog: filledWorkoutLog,
}

export const DeletedExercise = Template.bind({})
DeletedExercise.args = {
  ...defaultArgs,
  template: filledTemplateTableWithData,
  workoutLog: {
    ...filledWorkoutLog,
    entries: [filledWorkoutLog.entries[0]],
  },
}
