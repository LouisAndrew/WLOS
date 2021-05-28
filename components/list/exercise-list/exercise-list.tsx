import React, { FC, useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import uniqid from 'uniqid'
import { BiGridVertical } from 'react-icons/bi'
import { RiCloseFill } from 'react-icons/ri'
import classname from 'classnames/bind'

import { ExerciseModelWithId } from '@t/Exercise'

import style from './exercise-list.module.css'
import { ExerciseListItem } from './exercise-list-item'
import { Tooltip } from '@c/tooltip'
import { isEqual } from 'lodash'
import { ExerciseTable } from '@t/tables/Exercise'

const cx = classname.bind(style)

export type Props = {
  /**
   * Default value of exercises to be rendered in the list.
   */
  exercises: ExerciseModelWithId[]
  /**
   * Sets if the list should be editable
   */
  isEditable?: boolean
  /**
   * Handler function to handle changes within the list.
   */
  onChange?: (exercises: ExerciseModelWithId[]) => void
}

type ExerciseArrayItem = ExerciseModelWithId & { listId: string }

const getItem = (listId: string, exerciseArray: ExerciseArrayItem[]): ExerciseArrayItem => {
  return exerciseArray.find((item) => item.listId === listId)
}

const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const defaultExercise: ExerciseModelWithId = {
  name: '',
  reps: {
    start: -1,
    end: undefined,
  },
  sets: {
    start: -1,
    end: undefined,
  },
  exerciseId: '-1',
}

const createUniq = (exercises: ExerciseModelWithId[]) =>
  exercises.map((e) => ({ ...e, listId: uniqid() }))

const getIds = (exerciseArr: ExerciseArrayItem[]) => exerciseArr.map((item) => item.listId)

const ExerciseList: FC<Props> = ({ exercises, isEditable, onChange }) => {
  const [exerciseArray, setExerciseArray] = useState<ExerciseArrayItem[]>(createUniq(exercises))
  const [idList, setIdList] = useState<string[]>(getIds(exerciseArray))
  const [nextKey, setNextKey] = useState(uniqid())

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const { destination, source } = result
    const array = reorder(idList, source.index, destination.index)

    setIdList(array)
  }

  const handleNewExercise = (exerciseData: { name?: string; id?: number } = {}) => {
    // check if adding new exercise is allowed
    const isNewAllowed = exerciseArray.every((e) => e.name !== '')
    if (!isNewAllowed) {
      throw 'Input exercise name!'
    }

    const listId = nextKey
    setIdList([...idList, listId])
    setExerciseArray([...exerciseArray, { ...defaultExercise, ...exerciseData, listId }])
    setNextKey(uniqid())
  }

  const handleRemoveExercise = (listId: string) => {
    setExerciseArray(exerciseArray.filter((e) => e.listId !== listId))
    setIdList(idList.filter((id) => id !== listId))
  }

  const handleChangeExercise = (listId: string, e: ExerciseModelWithId) => {
    if (isEqual({ ...e, listId }, getItem(listId, exerciseArray))) {
      return
    }
    setExerciseArray(
      exerciseArray.map((exercise) => (exercise.listId === listId ? { ...e, listId } : exercise))
    )
  }

  useEffect(() => {
    const withoutListIds = exerciseArray.map((e) => {
      const { listId, ...exerciseData } = e
      return exerciseData
    })

    onChange?.(withoutListIds)
  }, [exerciseArray])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div data-testid="exercise-list-wrapper">
        <Droppable droppableId="exercise-list">
          {(provided, snapshot) => (
            <>
              <div
                className={cx({
                  'exercise-list': true,
                  'is-dragging-over': snapshot.isDraggingOver,
                })}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {idList.map((id, index) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={cx({
                          'exercise-list-item': true,
                          'is-dragging': snapshot.isDragging,
                        })}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        {isEditable && (
                          <Tooltip
                            trigger={
                              <button
                                className={`btn btn--icon btn--ghost ${style['drag-handle-btn']}`}
                                {...provided.dragHandleProps}
                              >
                                <BiGridVertical />
                              </button>
                            }
                            content="Drag to reorder exercise"
                          />
                        )}
                        <ExerciseListItem
                          defaultExercise={getItem(id, exerciseArray)}
                          isEditable={isEditable}
                          onChange={(e) => handleChangeExercise(id, e)}
                        />
                        {isEditable && (
                          <Tooltip
                            trigger={
                              <button
                                onClick={() => handleRemoveExercise(id)}
                                className={`btn btn--ghost-yellow btn--xs ${style['remove-btn']}`}
                              >
                                <RiCloseFill />
                              </button>
                            }
                            content="remove exercise from list"
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
              {isEditable && (
                <ExerciseListItem
                  className="mt-2 duration-200"
                  customStyle={{
                    opacity: snapshot.isDraggingOver ? 0 : 1,
                    transform: snapshot.isDraggingOver ? 'scale(0.8)' : 'scale(1)',
                  }}
                  key={nextKey}
                  onNewExercise={handleNewExercise}
                />
              )}
            </>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default ExerciseList
