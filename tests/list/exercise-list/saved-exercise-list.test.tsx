import { render, cleanup, fireEvent } from '@testing-library/react'
import SavedExerciseList, { Props } from '@c/list/saved-exercise-list/saved-exercise-list'
import { withMockUserData } from '@tests/utils/withMockUserData'
import { defaultUD } from '@lib/provider/useProvideUserData'

const component = (args: Partial<Props> = {}) => render(<SavedExerciseList {...args} />)

describe('Saved exercise list', () => {
  // * default implementation returned by `withMockUserData`
  const mockExercises = defaultUD.getSavedExercises()

  afterEach(cleanup)

  beforeEach(() => {
    withMockUserData({})
  })

  it.each(mockExercises.map(({ name }) => [name]))(
    "Renders all of the user's saved exercises",
    (name) => {
      const { queryByText: qtxt } = component()
      expect(qtxt(name)).toBeInTheDocument()
    }
  )

  it.each(mockExercises.map((e) => [e]))(
    'calls the `onSelect` method with appropriate parameter if one of the option is clicked',
    (exercise) => {
      const onSelect = jest.fn()

      const { getByText: txt } = component({ onSelect })
      fireEvent.click(txt(exercise.name))
      expect(onSelect).toBeCalledWith(exercise)
    }
  )
})
