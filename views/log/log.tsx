import React, { FC, useRef, useState } from 'react'
import uniqid from 'uniqid'
import { PageProps } from '@v/template/page-props'
import { ViewHeader } from '@c/view-header'
import { PageState } from '@c/view-header/view-header'
import { LogList } from '@c/list/log-list'
import { LogEntry, WorkoutLog } from '@t/WorkoutLog'
import { isWorkoutLogEqual } from '@lib/comparator'
import {
  RiBookletLine,
  RiCloseFill,
  RiDeleteBin6Line,
  RiFileList2Line,
  RiSaveLine,
} from 'react-icons/ri'

import style from './log.module.css'
import { TemplateTableWithData } from '@t/tables/Template'
import { convertExerciseTableToModel } from '@lib/exercise-helper'
import Popup from 'reactjs-popup'
import { SaveChangesModal } from '@c/modals'
import ConfirmDeleteModal from '@c/modals/confirm-delete-modal'
import { useUserData } from '@h/useUserData'

export type Props = PageProps<WorkoutLog> & { workoutLog: WorkoutLog }
const formatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

const Log: FC<Props> = ({ defaultState, template, workoutLog, handleDelete, handleSave }) => {
  const getNormalizedWorkoutLog = (l: WorkoutLog, t: TemplateTableWithData): WorkoutLog => {
    if (l.entries.length > 0) {
      return workoutLog
    }

    return {
      ...l,
      entries: t.exercises.map((e) => ({ exercise: convertExerciseTableToModel(e), sets: [] })),
    }
  }

  const [w, setW] = useState<WorkoutLog>(workoutLog)
  const [pageState, setPageState] = useState<PageState>(defaultState)
  const [isLogChanged, setIsLogChanged] = useState(false)
  const [popupStates, setPopupStates] = useState({
    SAVE_CHANGES: false,
    CONFIRM_DELETE: false,
    COMPARISON_SELECT: false,
  })
  const [key, setKey] = useState(uniqid())

  const [comparisonLog, setComparisonLog] = useState<WorkoutLog | undefined>(undefined)
  const availableComparison = useUserData()
    .getSavedLogs()
    .filter((log) => log.templateId === workoutLog.templateId && log.date !== workoutLog.date)

  const defaultLog = getNormalizedWorkoutLog(workoutLog, template)
  const currentLog = useRef<WorkoutLog>(defaultLog)
  const tempState = useRef<PageState>(null)

  const { name, color } = template

  const isEditable = pageState === PageState.CREATE || pageState === PageState.EDIT

  const handleChangePageState = (newState: PageState) => {
    // * ask if the changes should be applied
    if (pageState === PageState.EDIT && isLogChanged) {
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

  const goToNextState = () => {
    const value = tempState.current
    setPageState(value)
    tempState.current = null
    setPopupStates((prev) => ({ ...prev, SAVE_CHANGES: false, CONFIRM_DELETE: false }))
  }

  const handleEntriesChange = (e: LogEntry[]) => {
    if (isEditable) {
      const temp = currentLog.current
      if (!isWorkoutLogEqual(temp, { ...temp, entries: e })) {
        const newLog = {
          ...temp,
          entries: e,
        }
        currentLog.current = newLog
        checkForChanges(newLog)
      }
    }
  }

  const checkForChanges = (newLog: WorkoutLog) => {
    setIsLogChanged(!isWorkoutLogEqual(newLog, defaultLog))
  }

  const saveLog = async (cb?: () => void) => {
    await handleSave(currentLog.current, cb !== undefined || cb !== null)
    setW(currentLog.current)
    cb?.()
  }

  const discardChanges = () => {
    setKey(uniqid())
    goToNextState()
  }

  const deleteTemplate = () => {
    handleDelete(`${workoutLog.date.getTime()}_${workoutLog.templateId}`)
  }

  return (
    <div data-testid="log-wrapper" className="view-wrapper">
      <ViewHeader
        pageState={pageState}
        templateName={name}
        templateColorCode={color}
        handleChangePageState={handleChangePageState}
        isEditable={false}
      />
      <div>
        <div className={style.log_text_group}>
          <span className="view-text">DATE</span>
          <span className={style.log_text}>{formatter.format(w.date)}</span>
          <span className="view-text">EXERCISES</span>
          {isEditable && availableComparison.length > 0 ? (
            comparisonLog ? (
              <div
                className={`btn btn--ghost ${style.comparison_item} ${style.compare_select_btn} ${style.comparison}`}
              >
                <RiBookletLine />
                <div className={style.compare_select_details}>
                  <span>{template.name}</span>
                  <span className={style.date}>{formatter.format(comparisonLog.date)}</span>
                </div>
                <button
                  className={`btn btn--ghost ${style.compare_remove}`}
                  onClick={() => setComparisonLog(undefined)}
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            ) : (
              <button
                className={`btn btn--xs btn--ghost ${style.comparison_item} ${style.compare_btn}`}
                onClick={() => setPopupStates((prev) => ({ ...prev, COMPARISON_SELECT: true }))}
                data-testid="comparison-log"
              >
                <RiFileList2Line />
                COMPARE WORKOUT LOG
              </button>
            )
          ) : null}
        </div>
        <LogList
          template={template}
          workoutLog={w}
          isEditable={isEditable}
          onChange={handleEntriesChange}
          key={key}
          comparisonLog={comparisonLog}
        />
      </div>
      {isLogChanged && isEditable ? (
        <button className={`btn btn--s btn--ghost ${style['save-button']}`} data-testid="save-btn">
          <RiSaveLine className="mr-3 h-4 w-4" />
          SAVE CHANGES
        </button>
      ) : null}
      <Popup
        open={popupStates.SAVE_CHANGES}
        onClose={() => setPopupStates((prev) => ({ ...prev, SAVE_CHANGES: false }))}
        modal
        className="modal"
      >
        <SaveChangesModal
          onSaveClick={() => saveLog(goToNextState)}
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
          deletedItemName="log"
        />
      </Popup>
      <Popup
        open={popupStates.COMPARISON_SELECT}
        onClose={() => {
          setPopupStates((prev) => ({ ...prev, COMPARISON_SELECT: false }))
        }}
        modal
        className="modal"
      >
        <div className="modal-wrapper">
          <h3>workout logs to compare with</h3>
          <p>Please pick a workout log to compare your progress with</p>
          <div>
            {availableComparison.map((c) => (
              <button
                key={`${c.date.getTime()}_${c.templateId}`}
                className={`btn btn--ghost ${style.compare_select_btn}`}
                onClick={() => {
                  setComparisonLog(c)
                  setPopupStates((prev) => ({ ...prev, COMPARISON_SELECT: false }))
                }}
              >
                <RiBookletLine />
                <div className={style.compare_select_details}>
                  <span>{template.name}</span>
                  <span className={style.date}>{formatter.format(c.date)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default Log
