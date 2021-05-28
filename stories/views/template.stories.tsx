import React from 'react'
import { Story } from '@storybook/react'

import Template, { PageState, Props } from '@v/template/template'
import { filledTemplateTableWithData } from '@/mock/workout-template'

export default {
  title: 'Views/Template',
  component: Template,
}

const T: Story<Props> = (args) => (
  <div className="w-full flex flex-center">
    <Template {...args} />
  </div>
)

export const Default = T.bind({})
Default.args = {
  isEditable: true,
  defaultState: PageState.CREATE,
}
export const Filled = T.bind({})
Filled.args = {
  defaultState: PageState.EDIT,
  template: filledTemplateTableWithData,
}
