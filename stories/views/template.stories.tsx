import React from 'react'
import { Story } from '@storybook/react'

import Template, { PageState, Props } from '@v/template/template'
import { defaultTemplateTableWithData, filledTemplateTableWithData } from '@/mock/workout-template'

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
  defaultState: PageState.CREATE,
  template: defaultTemplateTableWithData,
}
export const Filled = T.bind({})
Filled.args = {
  defaultState: PageState.EDIT,
  template: filledTemplateTableWithData,
}
