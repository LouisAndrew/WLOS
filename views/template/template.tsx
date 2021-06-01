import React, { FC, useEffect, useRef, useState } from 'react'

import { ExerciseList } from '@c/list/exercise-list'
import { rangeToString, stringToRange } from '@lib/range-helper'
import { TemplateTableWithData } from '@t/tables/Template'
import { defaultTemplateTableWithData } from '@/mock/workout-template'

import style from './template.module.css'
import { IconType } from 'react-icons/lib'
import { RiBallPenLine, RiDeleteBin6Line, RiEyeLine, RiFile3Line, RiSaveLine } from 'react-icons/ri'
import Popup from 'reactjs-popup'
import { ColorPicker } from '@c/color-picker'
import { ExerciseModelWithId } from '@t/Exercise'
import { isExerciseListEqual } from '@lib/exercise-list-comparator'
import { SaveChangesModal } from '@c/modals'
import ConfirmDeleteModal from '@c/modals/confirm-delete-modal'

export type Props = {
  /**
   * Workout template to be shown.
   */
  template: TemplateTableWithData
  /**
   * Sets default state of the view component.
   */
  defaultState?: PageState
  /**
   * Handler function to be called when save button is clicked.
   */
  handleSave?: (template: TemplateTableWithData, withCallback?: boolean) => Promise<void>
  /**
   * Hanlder function to be called when user deletes the template.
   */
  handleDelete?: (templateId: number) => Promise<void>
}

export enum PageState {
  VIEW = 'Viewing',
  EDIT = 'Editing',
  DELETE = 'Deleting..',
  CREATE = 'Creating',
}

const PageStateIcon: Record<PageState, IconType> = {
  [PageState.CREATE]: RiFile3Line,
  [PageState.EDIT]: RiBallPenLine,
  [PageState.VIEW]: RiEyeLine,
  [PageState.DELETE]: RiDeleteBin6Line,
}

const checkIfEditable = (state: PageState) => state === PageState.EDIT || state === PageState.CREATE

// todo 3 states: create / edit, view [x]
// todo change color [x]
// todo change template name [x]
// todo render save button conditionally [x]
// todo option to delete template [x]
// todo [] create unit test
// todo [] create handler when user wants to delete the template
// todo [] create handler when user wants to save the template
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

  const Icon = PageStateIcon[pageState]

  return (
    <div data-testid="template-wrapper" className={style.wrapper}>
      <div className={style.header}>
        <Popup
          trigger={
            <button
              className={`btn btn--xs btn--ghost ${style['page-state']}`}
              data-testid="change-state-btn"
            >
              {pageState.toUpperCase()}
              <Icon />
            </button>
          }
          arrow={false}
          offsetY={8}
          position="bottom right"
          disabled={pageState === PageState.CREATE}
        >
          <>
            {Object.keys(PageState)
              .filter((key) => PageState[key] !== pageState && PageState[key] !== PageState.CREATE)
              .map((key) => {
                const value = PageState[key]
                const I = PageStateIcon[value]
                return (
                  <button
                    className={`btn btn--ghost btn--s w-full flex items-center ml-0`}
                    onClick={() => handleChangePageState(value)}
                    key={key}
                    data-testid="state-btn"
                    aria-label={`${key.toLowerCase()} template`}
                  >
                    <I className="mr-3" />
                    {key.toUpperCase()} TEMPLATE
                  </button>
                )
              })}
          </>
        </Popup>
        <div className={style['name-wrapper']}>
          <div
            className={style['color-indicator']}
            style={{ backgroundColor: templateColor }}
            data-testid="color-indicator"
            aria-label="Template Color"
          />
          <label className={style['name-input-label']}>
            TEMPLATE NAME
            <input
              type="text"
              placeholder="ENTER NAME"
              value={templateName}
              onChange={handleChangeTemplateName}
            />
          </label>
        </div>
        {isEditable && (
          <div className={style['button-group']}>
            <Popup
              arrow={false}
              position="bottom left"
              trigger={<button className="btn btn--ghost btn--xs">CHANGE COLOR</button>}
              offsetY={8}
            >
              <ColorPicker
                className="w-48"
                onColorChange={handleColorChange}
                defaultSelected={templateColor}
              />
            </Popup>
          </div>
        )}
      </div>
      <div>
        <span className={style['exercise-text']}>
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
