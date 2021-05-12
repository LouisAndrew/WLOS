import { render, fireEvent, cleanup } from '@testing-library/react'

import { Nav } from '@c/nav'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockImplementationOnce(() => ({
    pathname: '/',
  }))
})

jest.mock('@c/nav/nav-link/nav-link', () => jest.fn(() => <div />))

afterEach(cleanup)

const closeMenu = jest.fn()

const Component = <Nav showMenu={true} closeMenu={closeMenu} />

describe('Navigation component', () => {
  it('matches snapshot', () => {
    expect(render(Component, {})).toMatchSnapshot()
  })

  it('render arrow icon based on `shrink` state', () => {
    const result = render(Component)
    const shrinkBtn = result.getByTestId('shrink-toggle')

    const leftArrowTestId = 'left-arrow'
    const rightArrowTestId = 'right-arrow'

    expect(result.getByTestId(leftArrowTestId)).toBeInTheDocument()
    expect(result.queryByTestId(rightArrowTestId)).not.toBeInTheDocument()

    fireEvent.click(shrinkBtn)

    expect(result.queryByTestId(leftArrowTestId)).not.toBeInTheDocument()
    expect(result.getByTestId(rightArrowTestId)).toBeInTheDocument()
  })

  it('should call closeMenu function when close button is clicked', () => {
    const result = render(Component)
    const closeBtn = result.getByTestId('close-btn')

    fireEvent.click(closeBtn)
    expect(closeMenu).toBeCalled()
  })
})
