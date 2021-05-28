import React, { FC } from 'react'
import { RiAlarmWarningLine } from 'react-icons/ri'
import Modal from './modal'
export type Props = {
  /**
   * Function to call when user clicks the save button.
   */
  onSaveClick: () => void
  /**
   * Function to call when user clicks the discard button
   */
  onDiscardClick: () => void
}

const SaveChangesModal: FC<Props> = ({ onDiscardClick, onSaveClick }) => {
  return (
    <Modal
      onPrimaryClicked={onSaveClick}
      onSecondaryClicked={onDiscardClick}
      headerText="Looks like you haven't saved your changes yet.."
      bodyText="Do you want to save the changes you've made? Unsaved changes would be lost! 🙀"
      secondaryButtonText="Discard Changes"
      primaryButtonText="Save Changes"
      Icon={RiAlarmWarningLine}
      iconFill="yellow"
    />
  )
}

export default SaveChangesModal
