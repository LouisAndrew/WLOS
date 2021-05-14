import React from 'react'
import { Story } from '@storybook/react'

import MetricInput, { Props } from '@c/input/set-input/metric-input/metric-input'
import { MockUserDataProvider } from '@lib/context/UserDataContext'

export default {
  title: 'Components/Input/Set input/Metric input',
  component: MetricInput,
}

const Template: Story<Props & { parentArgs: any }> = ({ parentArgs = {}, ...rest }) => (
  <MockUserDataProvider {...parentArgs}>
    <div className="pl-20">
      <MetricInput isEditable onChange={(m) => console.log(m)} {...rest} />
    </div>
  </MockUserDataProvider>
)

export const Default = Template.bind({})
export const NoBand = Template.bind({})
NoBand.args = {
  parentArgs: {
    getUserBands: () => [],
  },
}
