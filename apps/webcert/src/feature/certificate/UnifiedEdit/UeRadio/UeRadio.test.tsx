import { fakeCertificate, fakeRadioBooleanElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeRadio from './UeRadio'

let testStore: EnhancedStore

const question = fakeRadioBooleanElement({ id: 'id', value: { selected: true }, config: { selectedText: 'ja', unselectedText: 'nej' } })

beforeEach(() => {
  testStore = configureApplicationStore([certificateMiddleware])

  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...question,
        },
      })
    )
  )
})

it('displays two radio buttons that toggle checked mode correctly', async () => {
  render(
    <Provider store={testStore}>
      <UeRadio disabled={false} question={question.id} />
    </Provider>
  )

  const radioButton = screen.getByLabelText('ja')
  await userEvent.click(radioButton)

  expect(radioButton).toBeChecked()
  expect(screen.getByRole('radio', { name: 'nej' })).not.toBeChecked()
})
