import { render, cleanup } from '@testing-library/react'

import { ListIcon } from '@c/list-item'
import { colorCodes } from '@c/color-picker'

const YELLOW_RGB_COLOR_CODE = 'RGB(245, 158, 11)'

afterEach(cleanup)

const Component = <ListIcon color={colorCodes.yellow} />
describe('List icon component', () => {
  it('renders the component', () => {
    const { queryByTestId } = render(Component)
    expect(queryByTestId('list-icon__wrapper')).toBeInTheDocument()
  })

  it('renders an icon even if `imgUrl` and `Icon` props is not defined', () => {
    const { queryByRole } = render(Component)
    expect(queryByRole('img')).toBeInTheDocument()
  })

  it("applies color to the wrapper's background color and icon fill", () => {
    const { getByTestId, getByRole, debug } = render(Component)
    expect(getByTestId('list-icon__wrapper').style.backgroundColor.toUpperCase()).toBe(
      YELLOW_RGB_COLOR_CODE
    )
    debug()
    expect(getByRole('img').getAttribute('fill')).toBe(colorCodes.yellow.toUpperCase())
  })

  describe('with custom image url', () => {
    const imgUrl = 'http://localhost:6060/img.png'
    const C = <ListIcon color={colorCodes.yellow} imgUrl={imgUrl} />
    it('renders an image sourced from the passed `imgUrl` prop', () => {
      const { getByRole } = render(C)
      expect(getByRole('img').getAttribute('src')).toBe(imgUrl)
    })
  })
})
