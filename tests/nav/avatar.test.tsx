import { render } from '@testing-library/react'

import { Avatar } from '@c/nav/avatar'

// TODO
describe('Avatar component', () => {
  it('matches snapshot', () => {
    expect(render(<Avatar />)).toMatchSnapshot()
  })
})
