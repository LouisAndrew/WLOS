import { render } from '@testing-library/react'

import Button from '../components/button'

it('should render', () => {
  render(<Button />)
  expect(true).toBeTruthy()
})
