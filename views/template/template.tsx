import React, { FC, useEffect, useRef, useState } from 'react'

import { ExerciseList } from '@c/list/exercise-list'
import { stringToRange } from '@lib/range-helper'
import { TemplateTableWithData } from '@t/tables/Template'
import { defaultTemplateTableWithData } from '@/mock/workout-template'

import style from './template.module.css'
import { IconType } from 'react-icons/lib'
import { RiBallPenLine, RiDeleteBin6Line, RiEyeLine, RiFile3Line, RiSaveLine } from 'react-icons/ri'
import Popup from 'reactjs-popup'
import { ColorPicker } from '@c/color-picker'
import { ExerciseModelWithId } from '@t/Exercise'
import { isExerciseListEqual } from '@lib/exercise-list-comparator'

export type Props = {
  /**
   * Workout template to be shown.
   */
  template?: TemplateTableWithData
  /**
   * Sets default state of the view component.
   */
  defaultState?: PageState
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
// todo render save button conditionally []
// todo option to delete template []
const Template: FC<Props> = ({ template, defaultState }) => {
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
    setPageState(newState)
  }

  const handleTemplateChange = (exercises: ExerciseModelWithId[]) => {
    setIsTemplateChanged(!isExerciseListEqual(getExercises(true), exercises))
    console.log({ e: getExercises(true), exercises })
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

  useEffect(() => {
    setCurrentTemplate({ name: templateName })
  }, [templateName])

  useEffect(() => {
    setCurrentTemplate({ color: templateColor })
  }, [templateColor])

  useEffect(() => {
    setIsEditable(checkIfEditable(pageState))
  }, [pageState])

  useEffect(() => {
    if (!template) {
      setPageState(PageState.CREATE)
      return
    }

    if (isEditable) {
      setPageState(PageState.EDIT)
      return
    }
  }, [])

  const Icon = PageStateIcon[pageState]

  return (
    <div data-testid="template-wrapper" className={style.wrapper}>
      <div className={style.header}>
        <Popup
          trigger={
            <button className={`btn btn--xs btn--ghost ${style['page-state']}`}>
              {pageState.toUpperCase()}
              <Icon />
            </button>
          }
          arrow={false}
          offsetY={8}
          position="bottom right"
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
                  >
                    <I className="mr-3" />
                    {key.toUpperCase()} TEMPLATE
                  </button>
                )
              })}
          </>
        </Popup>
        <div className={style['name-wrapper']}>
          <div className={style['color-indicator']} style={{ backgroundColor: templateColor }} />
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
      </div>
      <div>
        <span className={style['exercise-text']}>
          {getCurrentTemplate()?.exercises.length > 0 ? 'EXERCISES' : 'ADD EXERCISES TO TEMPLATE'}
        </span>
        <ExerciseList
          exercises={getExercises()}
          isEditable={isEditable}
          onChange={handleTemplateChange}
        />
      </div>
      {isTemplateChanged && (
        <button className={`btn btn--s btn--ghost ${style['save-button']}`}>
          <RiSaveLine className="mr-3 h-4 w-4" />
          SAVE CHANGES
        </button>
      )}
    </div>
  )
}

export default Template
