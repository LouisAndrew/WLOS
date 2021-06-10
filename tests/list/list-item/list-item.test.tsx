import { render, cleanup, fireEvent } from '@testing-library/react'
import { ListItem } from '@c/list-item'
import { colorCodes } from '@c/color-picker'

afterEach(cleanup)
const text = 'Workout'
const onClickItem = jest.fn()
const color = colorCodes.blue
const Component = <ListItem text={text} onClickItem={onClickItem} color={color} />

describe('List item', () => {
  it('renders the component', () => {
    const { queryByTestId } = render(Component)
    expect(queryByTestId('list-item__wrapper')).toBeInTheDocument()
  })

  it('renders the text if the `text` prop is passed', () => {
    const { queryByText } = render(Component)
    expect(queryByText(text)).toBeInTheDocument()
  })

  it('calls `onClickItem` function when the component is clicked', () => {
    const { getByTestId } = render(Component)
    fireEvent.click(getByTestId('list-item__wrapper'))
    expect(onClickItem).toBeCalled()
  })

  describe('custom children', () => {
    const C = (
      <ListItem text={text} color={color}>
        <div data-testid="test-child" />
      </ListItem>
    )

    it('renders the custom children', () => {
      const { queryByTestId } = render(C)
      expect(queryByTestId('test-child')).toBeInTheDocument()
    })

    it('does not render the text', () => {
      const { queryByText } = render(C)
      expect(queryByText(text)).not.toBeInTheDocument()
    })
  })

  describe('with option component', () => {
    const OptionComponent = () => <div data-testid="test-option" />
    const C = <ListItem text={text} OptionComponent={OptionComponent} color={color} />

    it('renders the `menu-button` component', () => {
      const { queryByTestId } = render(C)

      expect(queryByTestId('menu-button')).toBeInTheDocument()
    })

    it('renders the option component if menu button is clicked', () => {
      const { queryByTestId, getByTestId } = render(C)
      fireEvent.click(getByTestId('menu-button'))
      expect(queryByTestId('test-option')).toBeInTheDocument()
    })
  })
})
