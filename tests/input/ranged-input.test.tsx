import { render, cleanup, fireEvent } from '@testing-library/react'
import { RangedInput } from '@c/input/ranged-input'
afterEach(cleanup)

const onChange = jest.fn()
const Component = <RangedInput maxDigit={1} onChange={onChange} isEditable={true} />

const labels = {
  start: 'Range start',
  separator: 'Range separator',
  end: 'Range end',
}

// todo: write tests for keymaps
describe('Ranged input', () => {
  it('matches snapshot', () => {
    expect(render(Component)).toMatchSnapshot()
  })

  it('hides separator and range-end inputs on default', () => {
    const { getByLabelText: q } = render(Component)
    expect(q(labels.end)).not.toBeVisible()
    expect(q(labels.separator)).not.toBeVisible()
  })

  it('displays separator and range-end inputs when input wrapper is focused', () => {
    const { getByLabelText: q, getByTestId: qt } = render(Component)
    fireEvent.focus(qt('ranged-input-wrapper'))
    expect(q(labels.end)).toBeVisible()
    expect(q(labels.separator)).toBeVisible()
  })

  it('focuses the next input field if the current field is filled with numbers of character specified by `maxDigit` prop', () => {
    const { getByLabelText: q } = render(Component)
    fireEvent.change(q(labels.start), { target: { value: '1' } })
    expect(q(labels.separator)).toHaveFocus()

    fireEvent.change(q(labels.separator), { target: { value: '-' } })
    expect(q(labels.end)).toHaveFocus()

    fireEvent.change(q(labels.end), { target: { value: '2' } })
    expect(q(labels.end)).toHaveFocus()
  })

  it('does not change value of input field if the predecessor field has not filled yet', () => {
    const { getByLabelText: q } = render(Component)
    const start = q(labels.start)
    const end = q(labels.end)
    const separator = q(labels.separator)

    fireEvent.change(separator, { target: { value: '-' } })
    expect(separator.getAttribute('value')).not.toBe('-')
    expect(start).toHaveFocus()

    fireEvent.change(end, { target: { value: '2' } })
    expect(end.getAttribute('value')).not.toBe('2')
    expect(start).toHaveFocus()
  })

  it('sets the range-end input state to error if the end value is smaller than start value', () => {
    const { getByLabelText: q } = render(Component)
    const start = q(labels.start)
    const end = q(labels.end)

    fireEvent.change(start, { target: { value: '3' } })
    fireEvent.change(q(labels.separator), { target: { value: '-' } })
    fireEvent.change(end, { target: { value: '2' } })
    expect(end.classList).toContain('error')
  })
})
