import React from 'react'
import { Story } from '@storybook/react'

import ListItem, { Props } from '@c/list-item/list-item'
import { colorCodes } from '@c/color-picker'

export default {
  title: 'Components/List Item',
  component: ListItem,
}

const Template: Story<Props> = (args) => <ListItem {...args} />

export const Default = Template.bind({})
Default.args = {
  iconName: '',
  OptionComponent: undefined,
  text: 'Sample text',
  color: colorCodes.blue,
}

export const WithOptions = Template.bind({})
WithOptions.args = {
  iconName: 'a',
  OptionComponent: () => <button className="btn btn--primary">click me</button>,
  text: 'Sample text',
  color: colorCodes.green,
}
