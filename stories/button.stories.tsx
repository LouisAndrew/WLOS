import React, { FC } from 'react'
import { Story } from '@storybook/react'

type Props = {
  className: string
  text: string
}

const Button: FC<Props> = ({ className, text }) => (
  <button className={`btn ${className}`}>{text}</button>
)

export default {
  title: 'Components/Button',
  component: Button,
}

const Template: Story<Props> = (args) => <Button {...args} />
const text = 'Click me!'

export const Primary = Template.bind({})
Primary.args = {
  className: 'btn--primary',
  text,
}

export const Secondary = Template.bind({})
Secondary.args = {
  className: 'btn--secondary',
  text,
}

export const Ghost = Template.bind({})
Ghost.args = {
  className: 'btn--ghost',
  text,
}

export const GhostYellow = Template.bind({})
GhostYellow.args = {
  className: 'btn--ghost-yellow',
  text,
}
