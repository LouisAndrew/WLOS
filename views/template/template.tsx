import React, { FC, useEffect, useRef, useState } from 'react'

import { ExerciseList } from '@c/list/exercise-list'
import { rangeToString, stringToRange } from '@lib/range-helper'
import { TemplateTableWithData } from '@t/tables/Template'
import { defaultTemplateTableWithData } from '@/mock/workout-template'

import style from './template.module.css'
import { RiSaveLine } from 'react-icons/ri'
import Popup from 'reactjs-popup'
import { ExerciseModelWithId } from '@t/Exercise'
import { isExerciseListEqual } from '@lib/comparator'
import { SaveChangesModal } from '@c/modals'
import ConfirmDeleteModal from '@c/modals/confirm-delete-modal'
import ViewHeader, { PageState } from '@c/view-header/view-header'
import { PageProps } from './page-props'

export type Props = PageProps<TemplateTableWithData>

const checkIfEditable = (state: PageState) => state === PageState.EDIT || state === PageState.CREATE

const Template: FC<Props> = ({ template, defaultState, handleSave, handleDelete }) => {
  const currentTemplate = useRef<TemplateTableWithData>(template || defaultTemplateTableWithData)
  const getCurrentTemplate = () => currentTemplate.current
  const setCurrentTemplate = (t: Partial<TemplateTableWithData>) => {
    currentTemplate.current = { ...getCurrentTemplate(), ...t }
  }

  const [templateName, setTemplateName] = useState(getCurrentTemplate().name)
  const [templateColor, setTemplateColor] = useState(getCurrentTemplate().color)
  const [pageState, setPageState] = useState<PageState>(defaultState)
  const [isEditable, setIsEditable] = useState(false)
  const [isTemplateChanged, setIsTemplateChanged] = useState(false)
  const [popupStates, setPopupStates] = useState({ SAVE_CHANGES: false, CONFIRM_DELETE: false })

  const tempState = useRef<PageState>()

  const handleChangeTemplateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditable) {
      setTemplateName(e.target.value.toUpperCase())
    }
  }

  const handleColorChange = (colorCode: string) => {
    if (isEditable) {
      setTemplateColor(colorCode)
    }
  }

  const handleChangePageState = (newState: PageState) => {
    // * ask if the changes should be applied
    if (pageState === PageState.EDIT && isTemplateChanged) {
      setPopupStates((prev) => ({
        ...prev,
        SAVE_CHANGES: true,
      }))
      tempState.current = newState
      return
    }

    if (newState === PageState.DELETE) {
      tempState.current = pageState
      setPopupStates((prev) => ({
        ...prev,
        CONFIRM_DELETE: true,
      }))
    }

    setPageState(newState)
  }

  const handleTemplateChange = (exercises: ExerciseModelWithId[]) => {
    setIsTemplateChanged(!isExerciseListEqual(getExercises(true), exercises))
    setCurrentTemplate({
      exercises: exercises.map((e, i) => {
        const { name, exerciseId, sets, reps } = e
        return {
          exerciseData: {
            name,
            id: parseInt(exerciseId, 10),
            tags: [],
          },
          reps: rangeToString(reps),
          sets: rangeToString(sets),
          order: i,
        }
      }),
    })
  }

  const getExercises = (getDefault: boolean = false) => {
    const { exercises } = getDefault ? template : getCurrentTemplate()
    return [...exercises]
      .sort((a, b) => a.order - b.order)
      .map((e) => {
        const {
          sets,
          reps,
          exerciseData: { name, id },
        } = e

        return {
          name,
          sets: stringToRange(sets),
          reps: stringToRange(reps),
          exerciseId: id.toString(),
        }
      })
  }

  const saveTemplate = async (cb?: () => void) => {
    await handleSave(getCurrentTemplate(), cb !== undefined || cb !== null)
    cb?.()
  }

  const discardChanges = () => {
    setCurrentTemplate(template)
    setTemplateName(template.name)
    setTemplateColor(template.color)
    goToNextState()
  }

  const deleteTemplate = () => {
    handleDelete(template.id)
  }

  const goToNextState = () => {
    const value = tempState.current
    setPageState(value)
    tempState.current = null
    setPopupStates((prev) => ({ ...prev, SAVE_CHANGES: false, CONFIRM_DELETE: false }))
  }

  useEffect(() => {
    setCurrentTemplate({ name: templateName })
  }, [templateName])

  useEffect(() => {
    setCurrentTemplate({ color: templateColor })
  }, [templateColor])

  useEffect(() => {
    setIsEditable(checkIfEditable(pageState))
  }, [pageState])

  return (
    <div data-testid="template-wrapper" className="view-wrapper">
      <ViewHeader
        pageState={pageState}
        isEditable={isEditable}
        templateName={templateName}
        templateColorCode={templateColor}
        handleChangePageState={handleChangePageState}
        handleChangeTemplateName={handleChangeTemplateName}
        handleColorChange={handleColorChange}
      />
      <div>
        <span className="view-text">
          {getCurrentTemplate()?.exercises.length > 0 ? 'EXERCISES' : 'ADD EXERCISES TO TEMPLATE'}
        </span>
        <ExerciseList
          exercises={getExercises()}
          isEditable={isEditable}
          onChange={handleTemplateChange}
          key={pageState}
        />
      </div>
      {isTemplateChanged && (
        <button className={`btn btn--s btn--ghost ${style['save-button']}`} data-testid="save-btn">
          <RiSaveLine className="mr-3 h-4 w-4" />
          SAVE CHANGES
        </button>
      )}
      <Popup
        open={popupStates.SAVE_CHANGES}
        onClose={() => setPopupStates((prev) => ({ ...prev, SAVE_CHANGES: false }))}
        modal
        className="modal"
      >
        <SaveChangesModal
          onSaveClick={() => saveTemplate(goToNextState)}
          onDiscardClick={discardChanges}
        />
      </Popup>
      <Popup
        open={popupStates.CONFIRM_DELETE}
        onClose={() => {
          if (pageState === PageState.DELETE) {
            setPopupStates((prev) => ({ ...prev, CONFIRM_DELETE: false }))
            goToNextState()
          }
        }}
        modal
        className="modal"
      >
        <ConfirmDeleteModal
          onCancel={() => {
            setPopupStates((prev) => ({ ...prev, CONFIRM_DELETE: false }))
            goToNextState()
          }}
          onDelete={deleteTemplate}
          deletedItemName="template"
        />
      </Popup>
    </div>
  )
}

export default Template
