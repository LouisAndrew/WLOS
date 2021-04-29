import { render, cleanup, fireEvent } from '@testing-library/react'

import { ColorPicker, colorTable } from '@c/color-picker'

afterEach(cleanup)

const onColorChange = jest.fn()

const Component = <ColorPicker onColorChange={onColorChange} />

describe('color picker component', () => {
  it('should render the component', () => {
    const { getByTestId } = render(Component)
    expect(getByTestId('wrapper')).toBeInTheDocument()
  })

  it.each(colorTable)('should render all base colors', (colorName, colorCode) => {
    const { queryByTestId } = render(Component)
    const colorSelector = queryByTestId(`color-selector-${colorName}`)
    expect(colorSelector).toBeInTheDocument()
    expect(colorSelector).toHaveStyle(`background-color: ${colorCode}`)
  })

  it.each(colorTable)(
    'calls the `onColorChange` function when a specific color is clicked',
    (colorName, colorCode) => {
      const { getByTestId } = render(Component)
      const colorSelector = getByTestId(`color-selector-${colorName}`)
      fireEvent.click(colorSelector)
      expect(onColorChange).toBeCalled()
      expect(onColorChange).toBeCalledWith(colorCode)
    }
  )

  describe('custom color', () => {
    const colorCode = '#ffa'
    const customColorLabel = 'Custom color'
    const customColorPreviewTid = 'custom-color-preview'

    it('renders a custom color input', () => {
      const { queryByLabelText } = render(Component)
      expect(queryByLabelText(customColorLabel)).toBeInTheDocument()
    })

    it('displays color preview if custom-color input is filled', () => {
      const { getByLabelText, getByTestId } = render(Component)
      fireEvent.change(getByLabelText(customColorLabel), { target: { value: colorCode } })
      expect(getByTestId(customColorPreviewTid)).toHaveStyle(`background-color: ${colorCode}`)
    })

    it('calls `onColorChange` function when custom-color input is filled', () => {
      const colorCode = '#ffa'
      const { getByLabelText } = render(Component)
      fireEvent.change(getByLabelText(customColorLabel), { target: { value: colorCode } })
      expect(onColorChange).toBeCalled()
      expect(onColorChange).toBeCalledWith(colorCode)
    })
  })

  describe('default selected color', () => {
    it.each(colorTable)(
      "should mark color-selector as selected if the passed `defaultSelected` props' matches its color code",
      (colorName, colorCode) => {
        const { getByTestId } = render(
          <ColorPicker defaultSelected={colorCode} onColorChange={onColorChange} />
        )
        expect(getByTestId(`color-selector-${colorName}`).classList).toContain('is-active')
        expect(getByTestId(`color-selector-${colorName}`).childElementCount).toBe(1)
      }
    )
  })
})
