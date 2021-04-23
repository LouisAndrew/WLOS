import React from 'react'
import { Story } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import Nav, { Props } from '@c/nav/nav'
export default {
  title: 'Components/Navigation',
  component: Nav,
  decorators: [withNextRouter],
}

const Template: Story<Props> = (args) => <Nav {...args} />

export const Default = Template.bind({})
