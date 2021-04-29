import { render, cleanup } from '@testing-library/react'
import { AuthImage } from '@v/auth'

afterEach(cleanup)

const Component = <AuthImage />
describe('Auth Image component', () => {
  it('renders the component', () => {
    expect(render(Component).queryByTestId('wrapper')).toBeInTheDocument()
  })

  it('matches the snapshot', () => {
    expect(render(Component)).toMatchSnapshot()
  })
})
