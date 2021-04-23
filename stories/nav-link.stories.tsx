import React from 'react'
import { Story } from '@storybook/react'

import NavLink, { Props } from '@c/nav/nav-link/nav-link'
export default {
  title: 'Components/Navigation/Navigation Link',
  component: NavLink,
}

const Template: Story<Props> = (args) => <NavLink {...args} />

export const Default = Template.bind({})
