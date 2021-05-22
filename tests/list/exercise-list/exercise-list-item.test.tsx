import { render, cleanup, fireEvent, Matcher } from '@testing-library/react'
import ExerciseListItem, {
  Props,
} from '@c/list/exercise-list/exercise-list-item/exercise-list-item'
import { mockModel } from '@/mock/exercise'
import { withMockUserData } from '@tests/utils/withMockUserData'
import { ExerciseModel } from '@t/Exercise'
import { changeEvent } from '@tests/utils/changeEvent'
import { mockUserData } from '@/mock/mock-user-data'

const component = (args: Partial<Props> = {}) => render(<ExerciseListItem isEditable {...args} />)

type T = (text: Matcher) => HTMLElement

const setup = (t: T, p: T, e: ExerciseModel) => {
  fireEvent.click(t('new-exercise'))
  fireEvent.change(p('Exercise Name'), changeEvent(e.name))
  fireEvent.change(t('sets-range-start'), changeEvent(e.sets.start))
  fireEvent.change(t('sets-range-separator'), changeEvent('-'))
  fireEvent.change(t('sets-range-end'), changeEvent(e.sets.end))
  fireEvent.change(t('reps-range-start'), changeEvent(e.reps.start))
  fireEvent.blur(t('exercise-input-wrapper'))
}

describe('Exercise List Item', () => {
  afterEach(cleanup)
  beforeEach(() => {
    withMockUserData({})
  })

  const exercises = mockUserData.savedExercises

  it.each(
    exercises.map((e): [ExerciseModel, number] => {
      const { name } = e
      return [
        {
          name,
          sets: {
            start: 3,
          },
          reps: {
            start: 10,
          },
        },
        e.id,
      ]
    })
  )(
    "Calls the provided `onChange` method with the appropriate id when the exercise exists on user's saved exercises",
    (exercise, id) => {
      const onChange = jest.fn()
      const { getByTestId: t, getByPlaceholderText: p } = component({ onChange })
      setup(t, p, exercise)
      expect(onChange).toBeCalled()
      expect(onChange).lastCalledWith({ ...exercise, exerciseId: id.toString() })
    }
  )
})

it('Hides the button to show exercise lists when a known/saved exercise is inputted', () => {
  const { getByTestId: t, getByPlaceholderText: p, queryByRole: qr } = component()
  setup(t, p, mockModel)

  expect(qr('button', { name: 'MY LIST' })).not.toBeInTheDocument()
})

describe('Saved exercises is empty', () => {
  beforeEach(() => {
    cleanup()
    withMockUserData({ getSavedExercises: () => [] })
  })
  it("Calls the provided `onChange` method with id of -1 if the exercise doesn't exist on user's saved exercises", () => {
    const onChange = jest.fn()

    const { getByTestId: t, getByPlaceholderText: p } = component({ onChange })
    setup(t, p, mockModel)
    expect(onChange).toBeCalled()
    expect(onChange).toBeCalledWith({ ...mockModel, exerciseId: '-1' })
  })

  it('Displays a button to show exercise lists when an unknown exercise is inputted', () => {
    const { getByTestId: t, getByPlaceholderText: p, getByRole: r } = component()
    setup(t, p, mockModel)

    expect(r('button', { name: 'MY LIST' })).toBeInTheDocument()
  })
})
