import React, { FC, useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import uniqid from 'uniqid'
import { ExerciseModelWithId } from '@t/Exercise'

import { ExerciseListItem } from './exercise-list-item'

export type Props = {
  /**
   * Default value of exercises to be rendered in the list.
   */
  exercises: ExerciseModelWithId[]
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

// use: react-beautiful-dnd
// drag handle: RiGrDrag
const ExerciseList: FC<Props> = ({ exercises }) => {
  const [exerciseArray, setExerciseArray] = useState<ExerciseArrayItem[]>(
    exercises.map((e) => ({ ...e, listId: uniqid() }))
  )
  const [idList, setIdList] = useState<string[]>(exerciseArray.map((item) => item.listId))

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const { destination, source } = result
    const array = reorder(idList, source.index, destination.index)

    setIdList(array)
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
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <ExerciseListItem defaultExercise={getItem(id, exerciseArray)} />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default ExerciseList
