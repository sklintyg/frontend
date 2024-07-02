/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { TestProvider } from './TestProvider'

export const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: TestProvider }),
  }
}
