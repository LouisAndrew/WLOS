import { render, cleanup } from '@testing-library/react'
import ExerciseList, { Props } from '@c/list/exercise-list/exercise-list'

afterEach(cleanup)

const component = (args: Partial<Props> = {}) => render(<ExerciseList {...args} />)

describe('', () => {
    it('', () => {})
})