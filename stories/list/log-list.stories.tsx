import React from 'react'
import { Story } from '@storybook/react'

import LogList, { Props } from '@c/list/log-list/log-list'

export default {
    title: 'Components/List/Log list',
    component: LogList
}

const Template: Story<Props> = (args) => (
    <LogList {...args} />
)

export const Default = Template.bind({})