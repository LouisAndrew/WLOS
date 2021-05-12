import React from 'react'
import { Story } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import Nav, { Props } from '@c/nav/nav'
export default {
  title: 'Components/Navigation',
  component: Nav,
  decorators: [
    withNextRouter,
    (Story) => (
      <div className="px-6 py-10">
        <Story />
      </div>
    ),
  ],
}

const Template: Story<Props> = (args) => <Nav {...args} />

export const Default = Template.bind({})
