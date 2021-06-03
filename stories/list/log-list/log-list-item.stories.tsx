import React from 'react'
import { Story } from '@storybook/react'

import LogListItem, { Props } from '@c/list/log-list/log-list-item/log-list-item'

export default {
    title: 'Components/List/Log list/Log list item',
    component: LogListItem
}

const Template: Story<Props> = (args) => (
    <LogListItem {...args} />
)

export const Default = Template.bind({})