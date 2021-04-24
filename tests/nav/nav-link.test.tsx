import { render } from '@testing-library/react'

import { NavLink } from '@c/nav/nav-link'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockImplementationOnce(() => ({
    pathname: '/',
  }))
})

const defaultComponent = <NavLink type="HOME" />

describe('Nav link componnet', () => {
  it('matches the snapshot', () => {
    const result = render(defaultComponent)
    expect(result).toMatchSnapshot()
  })

  it('sets the link class to active if the pathname matches the current path', () => {
    const result = render(defaultComponent)
    expect(result.getByRole('button').classList.contains('container_active')).toBe(true)
  })

  it("doesn't sets the link class to active is pathname doesn't match the current path", () => {
    const result = render(<NavLink type="LOGS" />)
    expect(result.getByRole('button').classList.contains('container_active')).toBe(false)
  })
})
