import React, { FC } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Modal from './modal'

import style from './modal.module.css'

export type Props = {
  /**
   * Function to be called when delete button is clicked
   */
  onDelete: () => void
  /**
   * Function to be called when cancel button is clicked
   */
  onCancel: () => void
  /**
   * name of the deleted item (template/logs/..)
   */
  deletedItemName: string
}

const ConfirmDeleteModal: FC<Props> = ({ onDelete, onCancel, deletedItemName }) => (
  <Modal
    onPrimaryClicked={onDelete}
    onSecondaryClicked={onCancel}
    headerText={`Are you sure you want to delete this ${deletedItemName}?`}
    bodyText={`Deleted ${deletedItemName} cannot be restored!`}
    primaryButtonText="DELETE"
    secondaryButtonText="CANCEL"
    Icon={RiDeleteBin6Line}
    iconFill="red"
    className={style['confirm-delete-modal']}
  />
)

export default ConfirmDeleteModal
