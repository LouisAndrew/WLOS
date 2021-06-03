import { render, cleanup } from '@testing-library/react'
import LogListItem, { Props } from '@c/list/log-list/log-list-item/log-list-item'

afterEach(cleanup)

const component = (args: Partial<Props> = {}) => render(<LogListItem {...args} />)

describe('', () => {
    it('', () => {})
})