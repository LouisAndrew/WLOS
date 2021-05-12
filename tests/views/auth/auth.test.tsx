import { render, cleanup } from '@testing-library/react'
import { mockNextUseRouter } from '@tests/utils/mockNextRouter'
import { Auth } from '@v/auth'

beforeEach(() => {
  mockNextUseRouter({
    asPath: '',
  })
})
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
