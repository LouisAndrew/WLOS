import React from 'react'
import { Story } from '@storybook/react'

import AuthImage, { Props } from '@v/auth/auth-img'

export default {
  title: 'Views/Auth/Auth Image',
  component: AuthImage,
}

const Template: Story<Props> = (args) => <AuthImage {...args} />

export const Default = Template.bind({})
