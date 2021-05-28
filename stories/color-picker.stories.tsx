import React from 'react'
import { Story } from '@storybook/react'

import ColorPicker, { Props } from '@c/color-picker/color-picker'

export default {
  title: 'Components/Color Picker',
  component: ColorPicker,
}

const onColorChange = (value: string) => console.log(value)

const Template: Story<Props> = (args) => (
  <div className="popup-content w-48">
    <ColorPicker {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  onColorChange,
}

export const Picked = Template.bind({})
Picked.args = {
  onColorChange,
  defaultSelected: '#af4e12',
}
