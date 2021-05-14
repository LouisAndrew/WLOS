import { render, cleanup, fireEvent } from '@testing-library/react'
import BandWeightInput, { Props } from '@c/input/set-input/band-weight-input/band-weight-input'
import { Metric } from '@t/Metric'
import { withMockUserData } from '@tests/utils/withMockUserData'
import { mockUserData } from '@/mock/mock-user-data'
import { changeEvent } from '@tests/utils/changeEvent'

const bands = mockUserData.settings.bands.map((b) => [b])

const component = (args: Partial<Props> = {}) =>
  render(<BandWeightInput metric={Metric.BAND} {...args} />)

const getLabelText = (value: number) => `${value}-band-select`

describe('Band Weight input component and calls onChange when selected', () => {
  afterEach(cleanup)
  beforeEach(() => withMockUserData({}))
  it.each(bands)('Displays all of the provided user bands', (band) => {
    const { queryByLabelText: ql } = component()
    expect(ql(getLabelText(band.id))).toBeInTheDocument()
  })

  it.each(bands)('Sets the band(s) provided as defaultWeightValue as selected', (band) => {
    const value = band.id
    const { getByLabelText: l } = component({ defaultWeightValue: value })
    expect((l(getLabelText(value)) as HTMLInputElement).checked).toBeTruthy()
  })

  it.each(bands)('Calls the `onChange` function with appropriate parameter', (band) => {
    const onChange = jest.fn()
    const { getByLabelText: l } = component({ onChange })
    fireEvent.click(l(getLabelText(band.id)))
    expect(onChange).toBeCalled()
    expect(onChange).toBeCalledWith(band.id)
  })

  it('Stacks the band weights as parameter if multiple bands are selected', () => {
    const values = [bands[0][0], bands[1][0]]

    const onChange = jest.fn()
    const { getByLabelText: l } = component({ onChange })

    values.forEach((v) => fireEvent.click(l(getLabelText(v.id))))
    const expectedParam = values.map((v) => v.id.toString()).reduce((a, b) => a + b, '')

    expect(onChange).toBeCalledTimes(values.length + 1)
    expect(onChange).nthCalledWith(3, parseInt(expectedParam))
  })

  describe('Band and weights.', () => {
    const c = (args: Partial<Props> = {}) =>
      render(<BandWeightInput metric={Metric.BAND_KG} {...args} />)

    it('Renders an additional input for weight and disables it if no band is selected', () => {
      const { queryByLabelText: ql } = c()
      expect(ql('Additional Weight')).toBeInTheDocument()
      expect((ql('Additional Weight') as HTMLInputElement).disabled).toBeTruthy()
    })

    const bandValue = bands[0][0]
    const weightValue = 12.5
    const value = `${bandValue.id}000${weightValue}`

    it('Sets default values', () => {
      const { getByLabelText: l } = c({ defaultWeightValue: parseFloat(value) })
      expect((l(getLabelText(bandValue.id)) as HTMLInputElement).select).toBeTruthy()
      expect(l('Additional Weight').getAttribute('value')).toBe(weightValue.toString())
    })

    it('Calls the `onChange` function with appropriate parameter', () => {
      const onChange = jest.fn()
      const { getByLabelText: l } = c({ onChange })

      fireEvent.click(l(getLabelText(bandValue.id)))
      fireEvent.change(l('Additional Weight'), changeEvent(weightValue))
      expect(onChange).toBeCalled()
      expect(onChange).toBeCalledTimes(3)
      expect(onChange).nthCalledWith(3, parseFloat(value))
    })
  })
})
