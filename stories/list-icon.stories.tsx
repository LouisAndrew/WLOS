import React from 'react'
import { Story } from '@storybook/react'

import { Ri24HoursFill } from 'react-icons/ri'
import ListIcon, { Props } from '@c/list-item/list-icon/list-icon'
import { colorCodes } from '@c/color-picker'

export default {
  title: 'Components/List Item/List Icon',
  component: ListIcon,
}

const Template: Story<Props> = (args) => <ListIcon {...args} />

export const Default = Template.bind({})
Default.args = {
  color: colorCodes.green,
}

export const WithPhoto = Template.bind({})
WithPhoto.args = {
  color: colorCodes.red,
  imgUrl: 'https://picsum.photos/48',
}

export const CustomIcon = Template.bind({})
CustomIcon.args = {
  color: colorCodes.blue,
  Icon: Ri24HoursFill,
}
