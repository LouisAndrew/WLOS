import React from 'react'
import { Story } from '@storybook/react'

import BandWeightInput, { Props } from '@c/input/set-input/band-weight-input/band-weight-input'
import { MockUserDataProvider } from '@lib/context/UserDataContext'
import { UD } from '@lib/provider/useProvideUserData'
import { Metric } from '@t/Metric'

export default {
  title: 'Components/Input/Set input/Band weight input',
  component: BandWeightInput,
}

const Template: Story<Props & { parentArgs: Partial<UD> }> = ({ parentArgs = {}, ...args }) => (
  <MockUserDataProvider {...parentArgs}>
    <BandWeightInput onChange={(e) => console.log(e)} {...args} />
  </MockUserDataProvider>
)

export const Default = Template.bind({})
Default.args = {
  metric: Metric.BAND_KG,
}

export const Filled = Template.bind({})
Filled.args = {
  isEditable: true,
  metric: Metric.BAND_KG,
  defaultWeightValue: 1200012.5,
}
