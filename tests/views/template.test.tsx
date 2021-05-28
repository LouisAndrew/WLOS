import { defaultTemplateTableWithData } from '@/mock/workout-template'
import { render, cleanup } from '@testing-library/react'
import Template, { PageState, Props } from '@v/template/template'

afterEach(cleanup)

const component = (args: Partial<Props> = {}) =>
  render(
    <Template defaultState={PageState.VIEW} template={defaultTemplateTableWithData} {...args} />
  )

describe('Template page', () => {
  it('renders the component', () => {
    expect(component().getByTestId('template-wrapper')).toBeInTheDocument()
  })

  it.skip('matches the snapshot', () => {
    expect(component()).toMatchSnapshot()
  })
})
