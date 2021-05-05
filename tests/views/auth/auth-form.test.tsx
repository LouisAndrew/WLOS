import { render, cleanup, fireEvent } from '@testing-library/react'
import * as auth from '@h/useAuth'

import { AuthForm } from '@v/auth'
import { mockNextUseRouter } from '@tests/utils/mockNextRouter'
import { mockUseAuth } from '@tests/utils/mockUseAuth'

const signIn = jest.fn()
const signInWithGoogle = jest.fn()
const signUp = jest.fn()

afterEach(cleanup)
beforeEach(() => {
  mockNextUseRouter({
    asPath: '/auth?sign-in',
  })
})

const testIds = {
  signIn: 'sign-in',
  signInGoogle: 'sign-in-google',
  signUp: 'sign-up',
}

const username = 'john@doe.com'
const password = 123456

const Component = <AuthForm />

describe('Auth form component', () => {
  it('renders the component', () => {
    const wrapper = render(Component)
    expect(wrapper.queryByTestId('auth-form-wrapper')).toBeInTheDocument()
  })

  it('matches the snapshot', () => {
    expect(render(Component)).toMatchSnapshot()
  })

  describe('renders appropriate buttons on sign-in', () => {
    beforeEach(() => {
      mockNextUseRouter({
        query: { 'sign-in': '' },
      })
      mockUseAuth({
        signIn,
        signInWithGoogle,
        signUp,
      })
    })

    afterEach(cleanup)
    // const { queryByTestId: q, getByLabelText: g, getByTestId: gTid, debug } = render(Component)
    it('renders the sign in button', () => {
      expect(render(Component).queryByTestId(testIds.signIn)).toBeInTheDocument()
    })

    it('renders the signin with google button', () => {
      expect(render(Component).queryByTestId(testIds.signInGoogle)).toBeInTheDocument()
    })

    it('does not render the sign up button', () => {
      expect(render(Component).queryByTestId(testIds.signUp)).not.toBeInTheDocument()
    })

    it('calls the `signIn` button when sign in button is clicked and inputs are filled', () => {
      const { getByLabelText: g, getByRole: gRole, debug, getByPlaceholderText: gptxt } = render(
        Component
      )

      const usernameInput = g('Username')
      const passwordInput = gptxt('Password')

      fireEvent.change(usernameInput, { target: { value: username } })
      fireEvent.change(passwordInput, { target: { value: password } })
      // fireEvent.click(gTid(testIds.signIn))
      fireEvent.submit(gRole('form'))

      // event propagation not supported
      setTimeout(() => {
        expect(signIn).toBeCalled()
        expect(signIn).toBeCalledWith(username, password)
      }, 50)
    })

    it('does not call the `signIn` function when the inputs are not filled completely', () => {
      const { getByTestId: gTid } = render(Component)
      fireEvent.click(gTid(testIds.signIn))
      expect(signIn).not.toBeCalled()
    })

    it('calls the `signInWithGoogle` function when sign-in-google button is clicked', () => {
      const { getByTestId: gTid } = render(Component)
      fireEvent.click(gTid(testIds.signInGoogle))
      setTimeout(() => {
        expect(signInWithGoogle).toBeCalled()
        expect(signInWithGoogle).toBeCalledWith()
      }, 50)
    })
  })

  describe('renders appropriate buttons on sign-up', () => {
    beforeEach(() => {
      mockNextUseRouter({ asPath: '/auth?sign-up' })
      mockUseAuth({
        signIn,
        signInWithGoogle,
        signUp,
      })
    })

    afterEach(cleanup)
    // const { queryByTestId: q, getByTestId: gTid, getByLabelText: g } = render(Component)
    it('does not render the sign in button', () => {
      const { queryByTestId: q } = render(Component)

      expect(q(testIds.signIn)).not.toBeInTheDocument()
    })

    it('does not render the signin with google button', () => {
      const { queryByTestId: q } = render(Component)

      expect(q(testIds.signInGoogle)).not.toBeInTheDocument()
    })

    it('renders the sign up button', () => {
      const { queryByTestId: q } = render(Component)

      expect(q(testIds.signUp)).toBeInTheDocument()
    })

    it('calls the `signIn` button when sign in button is clicked and inputs are filled', () => {
      const { getByRole: gRole, getByLabelText: g, getByPlaceholderText: gptxt } = render(Component)
      const usernameInput = g('Username')
      const passwordInput = gptxt('Password')

      fireEvent.change(usernameInput, { target: { value: username } })
      fireEvent.change(passwordInput, { target: { value: password } })
      fireEvent.click(gRole('form'))

      setTimeout(() => {
        expect(signUp).toBeCalled()
        expect(signUp).toBeCalledWith(username, password)
      }, 50)
    })

    it('does not call the `signUp` function when the inputs are not filled completely', () => {
      const { getByTestId: gTid } = render(Component)

      fireEvent.click(gTid(testIds.signUp))
      expect(signUp).not.toBeCalled()
    })
  })
})
