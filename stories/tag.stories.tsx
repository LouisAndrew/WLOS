import React from 'react'
import { Story } from '@storybook/react'

import Tag, { Props } from '@c/tag/tag'
import { colorCodes } from '@c/color-picker'

export default {
  title: 'Components/Tag',
  component: Tag,
}

const text = 'Chest'
const color = colorCodes.red

const Template: Story<Props> = (args) => <Tag {...args} />

export const Default = Template.bind({})
Default.args = {
  text,
  color,
}

export const Clearable = Template.bind({})
Clearable.args = {
  text,
  color: colorCodes.blue,
  isClearable: true,
}
