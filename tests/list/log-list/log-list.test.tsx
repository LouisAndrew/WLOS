import { render, cleanup } from '@testing-library/react'
import LogList, { Props } from '@c/list/log-list/log-list'

afterEach(cleanup)

const component = (args: Partial<Props> = {}) => render(<LogList exercises={[]} {...args} />)

describe('Log list component', () => {
  it('', () => {})
})
