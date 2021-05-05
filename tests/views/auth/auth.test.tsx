import { render, cleanup } from '@testing-library/react'
import { Auth } from '@v/auth'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: '',
    replace: () => {},
  }),
}))
afterEach(cleanup)

const Component = <Auth />
describe('Auth view component', () => {
  it('renders the component', () => {
    expect(render(Component).queryByTestId('auth-wrapper')).toBeInTheDocument()
  })

  it('matches the snapshot', () => {
    expect(render(Component)).toMatchSnapshot()
  })
})
