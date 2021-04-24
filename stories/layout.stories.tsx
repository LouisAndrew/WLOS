import React from 'react'
import { Story } from '@storybook/react'

import Layout, { Props } from '@c/layout/layout'

export default {
  title: 'Components/Layout',
  component: Layout,
}

const Template: Story<Props> = (args) => <Layout {...args} />

export const Default = Template.bind({})
