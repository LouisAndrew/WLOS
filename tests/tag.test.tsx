import { render, cleanup, fireEvent } from '@testing-library/react'
import { Tag } from '@c/tag'
import { colorCodes } from '@c/color-picker'

afterEach(cleanup)

const onClearTag = jest.fn()
const text = 'Test'
const Component = <Tag text={text} color={colorCodes.red} />
describe('Tag component', () => {
  it('renders the element', () => {
    const { queryByTestId } = render(Component)
    expect(queryByTestId('wrapper')).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    const result = render(Component)
    expect(result).toMatchSnapshot()
  })

  it('renders provided text', () => {
    const { queryByText } = render(Component)
    expect(queryByText(text)).toBeInTheDocument()
  })

  it('matches background color with the provided color', () => {
    const { getByTestId } = render(Component)
    // hex in rgb 👇
    expect(getByTestId('wrapper').style.backgroundColor.toUpperCase()).toEqual('RGB(239, 68, 68)')
  })

  describe('clearable tag', () => {
    const C = <Tag text={text} color={colorCodes.red} isClearable onClearTag={onClearTag} />
    it('should display a clear button when wrapper is hovered', () => {
      const { getByTestId, queryByTestId } = render(C)
      const wrapper = getByTestId('wrapper')
      fireEvent.mouseEnter(wrapper)
      expect(queryByTestId('clear-button')).toBeVisible()
    })

    it('should call the `onClearTag` function when the clear button is clicked', () => {
      const { getByTestId } = render(C)
      fireEvent.click(getByTestId('clear-button'))
      expect(onClearTag).toBeCalled()
    })
  })
})
