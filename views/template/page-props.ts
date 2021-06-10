import { PageState } from '@c/view-header/view-header'
import { TemplateTableWithData } from '@t/tables/Template'

export type PageProps<T> = {
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
  handleSave?: (data: T, withCallback?: boolean) => Promise<void>
  /**
   * Hanlder function to be called when user deletes the template.
   */
  handleDelete?: (id: number | string) => Promise<void>
}
