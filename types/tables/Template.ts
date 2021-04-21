import { UserDataTable } from './UserData'
import { Table } from './Table'

/**
 * type of the template
 * @value 0 for workout template
 * @value 1 for warmup template
 */
export type TemplateType = 0 | 1

export type TemplateTable = Table & {
  /**
   * type of the template
   * @value 0 for workout template
   * @value 1 for warmup template
   */
  type: TemplateType
  /**
   * user who created the template
   */
  created_by: number | UserDataTable
  /**
   * tag ids of the template
   * ! WIP
   */
  tags?: number[]
  /**
   * name of the template
   */
  name: string
  /**
   * color code of the template.
   * todo: decide if this should be editable
   */
  color: string
}
