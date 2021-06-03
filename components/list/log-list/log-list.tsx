import { TemplateTableWithData } from '@t/tables/Template'
import React, { FC } from 'react'

export type Props = {
  /**
   * Default exercises that has to be rendered.
   * ! Exercise should not be editable
   * ! Exercise could be deleted
   */
  exercises: TemplateTableWithData[]
}

const LogList: FC<Props> = () => {
  return <div data-testid="log-list-wrapper" />
}

export default LogList
