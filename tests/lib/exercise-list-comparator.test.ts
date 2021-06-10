import { mockModel2, mockModelWithId } from '@/mock/exercise'
import { isExerciseListEqual } from '@lib/comparator'

const mockModelWithId2 = { ...mockModel2, exerciseId: '12' }

describe('Exercise list comparator helper function', () => {
  it('Should retrun true if two lists are identical', () => {
    expect(
      isExerciseListEqual([mockModelWithId, mockModelWithId2], [mockModelWithId, mockModelWithId2])
    ).toBeTruthy()
  })

  it('Should return false if two lists have the same item but with a different order', () => {
    expect(
      isExerciseListEqual([mockModelWithId, mockModelWithId2], [mockModelWithId2, mockModelWithId])
    ).toBeFalsy()
  })

  it('Should return false if the two list are unidentical', () => {
    expect(isExerciseListEqual([mockModelWithId], [mockModelWithId, mockModelWithId2])).toBeFalsy()
  })

  it('Should return false if one of the attributes within the list item is unidentical', () => {
    expect(
      isExerciseListEqual(
        [mockModelWithId, mockModelWithId2],
        [{ ...mockModelWithId, name: 'Hello, world' }, mockModelWithId2]
      )
    ).toBeFalsy()
  })
})
