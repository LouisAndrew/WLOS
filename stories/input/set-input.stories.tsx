import React from 'react'
import { Story } from '@storybook/react'

import SetInput, { Props } from '@c/input/set-input/set-input'

export default {
  title: 'Components/Input/Set input',
  component: SetInput,
}

const Template: Story<Props> = (args) => <SetInput isEditable {...args} />

export const Default = Template.bind({})
Default.args = {
  setNumber: 1,
}
