import { Table } from './Table'
import { TemplateTable } from './Template'
import { UserDataTable } from './UserData'

export type LogTable = Table & {
  /**
   * id of the template or its data
   */
  template_id: number | TemplateTable
  /**
   * client generated timestamp of when the log is created
   */
  date: number
}

export type SavedLogsTable = Table & {
  /**
   * id of the user or his/her data
   */
  user_id: number | UserDataTable
  /**
   * id of the exercise log / its data
   */
  log_id: number | LogTable
}
