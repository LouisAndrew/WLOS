import { cleanup, fireEvent, render } from '@testing-library/react'
import { SetInput } from '@c/input/set-input'
import { mockExerciseSet } from '@/mock/exercise-set'
import { changeEvent } from '@tests/utils/changeEvent'
import { ExerciseSet } from '@t/ExerciseSet'
import { Metric } from '@t/Metric'

const SET_NUMBER = 1
const onSetChange = jest.fn()
const component = (args = {}) =>
  render(
    <SetInput
      setNumber={SET_NUMBER}
      inputIds={'mock'}
      isEditable
      onSetChange={onSetChange}
      {...args}
    />
  )
const defaultExerciseSet: ExerciseSet = {
  setNumber: SET_NUMBER,
  repsCount: -1,
  weightValue: -1,
  weightMetric: Metric.KG,
}

describe('Set input component', () => {
  afterEach(cleanup)
  describe('With default value', () => {
    it('Displays all default values', () => {
      const { getByTestId: t, getByLabelText: l } = component({
        defaultRepsCount: mockExerciseSet.repsCount,
        defaultWeightValue: mockExerciseSet.weightValue,
        defaultMetric: mockExerciseSet.weightMetric,
        defaultReview: mockExerciseSet.review,
      })

      expect(l('REPS').getAttribute('value')).toContain(mockExerciseSet.repsCount)
      expect(l('WEIGHT').getAttribute('value')).toContain(mockExerciseSet.weightValue)
      expect(t('metric-input-wrapper').textContent.toLowerCase()).toContain(
        mockExerciseSet.weightMetric.toLowerCase()
      )
      // expect(t('set-review').getAttribute('--value')).toBe(mockExerciseSet.review)
    })
  })

  it('Displays the set number', () => {
    const { getByTestId: t } = component()
    expect(t('set-number')).toHaveTextContent(`#${SET_NUMBER}`)
  })

  describe('Calls `onSetChange` with appropriate parameters', () => {
    it('Reacts to changes on `reps` field', () => {
      const { getByLabelText: l } = component()
      const value = mockExerciseSet.repsCount
      fireEvent.change(l('REPS'), changeEvent(value))
      expect(onSetChange).toBeCalled()
      expect(onSetChange).toBeCalledWith<[ExerciseSet]>({
        ...defaultExerciseSet,
        repsCount: value,
      })
    })

    it('Reacts on changes on weight field', () => {
      const { getByLabelText: l } = component()
      const value = mockExerciseSet.weightValue
      fireEvent.change(l('WEIGHT'), changeEvent(value))
      expect(onSetChange).toBeCalled()
      expect(onSetChange).toBeCalledWith<[ExerciseSet]>({
        ...defaultExerciseSet,
        weightValue: value,
      })
    })
  })
})
