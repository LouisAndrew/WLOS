import React, { FC, useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import uniqid from 'uniqid'
import { BiGridVertical } from 'react-icons/bi'
import classname from 'classnames/bind'

import { ExerciseModelWithId } from '@t/Exercise'

import style from './exercise-list.module.css'
import { ExerciseListItem } from './exercise-list-item'
import Popup from 'reactjs-popup'
import { Tooltip } from '@c/tooltip'

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
  },
  sets: {
    start: -1,
  },
  exerciseId: '-1',
}

// todo create unit test
// todo handle error if exercise name is not filled
// todo handle chanegs on every exerciseinput
// todo change styling when a draggable is being dragged.
const ExerciseList: FC<Props> = ({ exercises, isEditable }) => {
  const [exerciseArray, setExerciseArray] = useState<ExerciseArrayItem[]>(
    exercises.map((e) => ({ ...e, listId: uniqid() }))
  )
  const [idList, setIdList] = useState<string[]>(exerciseArray.map((item) => item.listId))
  const [nextKey, setNextKey] = useState(uniqid())

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const { destination, source } = result
    const array = reorder(idList, source.index, destination.index)

    setIdList(array)
  }

  const handleNewExercise = () => {
    const listId = nextKey
    setIdList([...idList, listId])
    setExerciseArray([...exerciseArray, { ...defaultExercise, listId }])
    setNextKey(uniqid())
  }

  const handleRemoveExercise = (listId: string) => {
    setExerciseArray(exerciseArray.filter((e) => e.listId !== listId))
    setIdList(idList.filter((id) => id !== listId))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div data-testid="exercise-list-wrapper">
        <Droppable droppableId="exercise-list">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {idList.map((id, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div
                      className={style['exercise-list-item']}
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
                      />
                      {isEditable && (
                        <Tooltip
                          trigger={
                            <button
                              onClick={() => handleRemoveExercise(id)}
                              className={`btn btn--ghost-yellow btn--xs ${style['remove-btn']}`}
                            >
                              REMOVE
                            </button>
                          }
                          content="remove exercise from list"
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
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
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default ExerciseList
