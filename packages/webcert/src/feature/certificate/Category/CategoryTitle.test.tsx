import * as utils from '@frontend/common/src/utils/certificateUtils'
import { render, screen } from '@testing-library/react'
import CategoryTitle from './CategoryTitle'

it('displays the correct title', () => {
  const isDraftSavedSpy = jest.spyOn(utils, 'isDraftSaved')

  isDraftSavedSpy.mockReturnValue(true)

  render(<CategoryTitle>Test title</CategoryTitle>)
  expect(screen.getByRole('heading', { name: /Test title/i })).toBeInTheDocument()
})
