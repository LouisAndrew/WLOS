import React from 'react'
import { Story } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import NavLink, { Props } from '@c/nav/nav-link/nav-link'
export default {
  title: 'Components/Navigation/Navigation Link',
  component: NavLink,
  decorators: [withNextRouter],
}

const Template: Story<Props> = (args) => <NavLink {...args} />

export const Default = Template.bind({})
Default.args = {
  type: 'HOME',
  shouldShrink: true,
}

export const Logs = Template.bind({})
Logs.args = {
  type: 'LOGS',
}
