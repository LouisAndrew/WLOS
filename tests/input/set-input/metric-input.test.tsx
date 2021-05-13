import { render, cleanup, fireEvent } from '@testing-library/react'
import { MetricInput } from '@c/input/set-input/metric-input'
import { withMockUserData } from '@tests/utils/withMockUserData'
import { Metric } from '@t/Metric'

afterEach(cleanup)
beforeEach(() => withMockUserData({}))

const component = (args = {}) => render(<MetricInput isEditable {...args} />)

describe('Metric input component', () => {
  it('Displays default metric value if provided', () => {
    const value = Metric.LBS
    const { baseElement: base } = component({ defaultMetric: value })
    expect(base.textContent).toContain(value)
  })

  it('Displays metric list if the wrapper is clicked', () => {
    const { getByTestId: t } = component()
    fireEvent.click(t('metric-input-wrapper'))
    expect(t('metric-input-select-list')).toBeInTheDocument()
  })

  it.each(Object.values(Metric).map((value) => [value]))(
    'Calls the onChange function when one of the select item is clicked',
    (metric) => {
      const onChange = jest.fn()
      const { getByTestId: t } = component({ onChange })
      fireEvent.click(t('metric-input-wrapper'))
      fireEvent.click(t(metric))
      expect(onChange).toBeCalled()
      expect(onChange).toBeCalledWith(metric)
    }
  )

  describe('No Bands', () => {
    afterEach(cleanup)
    beforeAll(() => withMockUserData({ getUserBands: () => [] }))
    it('Does not display the `BAND` and `BAND_KG` select items if user does not have any saved bands', () => {
      const { queryByTestId: qt } = component()
      fireEvent.click(qt('metric-input-wrapper'))
      expect(qt(Metric.BAND_KG)).not.toBeInTheDocument()
      expect(qt(Metric.BAND)).not.toBeInTheDocument()
    })
  })
})
