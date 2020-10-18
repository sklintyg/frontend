import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import DraftSavedStatus from './DraftSavedStatus'

it('displays that the draft is saved', () => {
  const isDraftSavedSpy = jest.spyOn(utils, 'isDraftSaved')

  isDraftSavedSpy.mockReturnValue(true)
  // @ts-expect-error we don't need to send all props
  render(<DraftSavedStatus />)
  expect(screen.getByText(/utkastet är sparat/i)).toBeInTheDocument()
})

it('doesnt render anything', async () => {
  const isDraftSavedSpy = jest.spyOn(utils, 'isDraftSaved')

  isDraftSavedSpy.mockReturnValue(false)

  // @ts-expect-error we don't need to send all props
  render(<DraftSavedStatus />)
  expect(screen.queryByText(/utkastet är sparat/i)).not.toBeInTheDocument()
})
