import type { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeCertificateValidationError, fakeTextFieldElement } from '../../../faker'
import { showValidationErrors, updateCertificate, updateClientValidationErrors } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import type { RootState } from '../../../store/store'
import QuestionEditComponent from './QuestionEditComponent'

let testStore: EnhancedStore<RootState>

beforeEach(() => {
  testStore = configureApplicationStore([certificateMiddleware])
})

function ComponentWrapper(props: ComponentProps<typeof QuestionEditComponent>) {
  const [show, setShow] = useState(true)
  return (
    <>
      {show && <QuestionEditComponent {...props} />}
      <button type="button" onClick={() => setShow(false)}>
        Hide component
      </button>
    </>
  )
}

it('Should clear client validation errors once removed', async () => {
  const question = fakeTextFieldElement({ id: '1' })['1']
  const certificate = fakeCertificate({ data: { [question.id]: question } })
  const validationError = fakeCertificateValidationError({ id: question.id })
  render(
    <Provider store={testStore}>
      <ComponentWrapper question={question} disabled={false} />
    </Provider>
  )
  testStore.dispatch(updateCertificate(certificate))
  testStore.dispatch(showValidationErrors())
  testStore.dispatch(updateClientValidationErrors({ [question.id]: [validationError] }))

  expect(getVisibleValidationErrors(question.id)(testStore.getState())).toStrictEqual([validationError])

  await expect(screen.getByRole('group')).toBeInTheDocument()

  // eslint-disable-next-line deprecation/deprecation, testing-library/no-unnecessary-act
  await act(async () => userEvent.click(screen.getByRole('button', { name: 'Hide component' })))

  await expect(screen.queryByRole('group')).not.toBeInTheDocument()

  expect(getVisibleValidationErrors(question.id)(testStore.getState())).toStrictEqual([])
})
