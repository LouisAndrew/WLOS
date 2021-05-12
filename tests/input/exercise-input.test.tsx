import { ExerciseInput } from '@c/input/exercise-input'
import { render, cleanup, fireEvent } from '@testing-library/react'

import { mockModel } from '@/mock/exercise'
import { changeEvent } from '../utils/changeEvent'

const onChange = jest.fn()

const Component = <ExerciseInput onChange={onChange} isEditable={true} />
describe('Exercise input', () => {
  afterEach(cleanup)
  it('matches the snapshot', () => {
    expect(render(Component).getByTestId('exercise-input-wrapper')).toBeInTheDocument()
  })

  it('creates new exercise', () => {
    const { getByTestId: gt, getByPlaceholderText: gp } = render(Component)
    fireEvent.change(gp('Exercise Name'), changeEvent(mockModel.name))
    fireEvent.change(gt('sets-range-start'), changeEvent(mockModel.sets.start))
    fireEvent.change(gt('sets-range-separator'), changeEvent('-'))
    fireEvent.change(gt('sets-range-end'), changeEvent(mockModel.sets.end))
    fireEvent.change(gt('reps-range-start'), changeEvent(mockModel.reps.start))

    fireEvent.blur(gt('exercise-input-wrapper'))
    expect(onChange).toBeCalled()
    expect(onChange).toBeCalledWith(mockModel)
  })
})
