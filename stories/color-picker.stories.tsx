import React from 'react'
import { Story } from '@storybook/react'

import ColorPicker, { Props } from '@c/color-picker/color-picker'

export default {
  title: 'Components/Color Picker',
  component: ColorPicker,
}

const onColorChange = (value: string) => console.log(value)

const Template: Story<Props> = (args) => <ColorPicker {...args} />

export const Default = Template.bind({})
Default.args = {
  onColorChange,
}
