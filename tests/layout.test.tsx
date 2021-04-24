import { render, cleanup, fireEvent } from '@testing-library/react'

import { Layout } from '@c/layout'

afterEach(cleanup)

const Component = <Layout />

describe('main layout component', () => {
  it('matches snapshot', () => {
    expect(render(Component)).toMatchSnapshot()
  })

  it('show nav component when menu button is clicked', () => {
    const result = render(Component)
    // const menuBtn = result.getByTestId('menu-btn')

    // fireEvent.click(menuBtn)

    // const navComponent = result.getByRole('navigation')
    // expect(navComponent.classList).toContain('container_show_mobile')
  })
})
