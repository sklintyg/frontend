import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import {
  fakeCertificate,
  fakeCertificateValue,
  fakeDateElement,
  fakeMaxDateValidation,
  fakeMedicalInvestigationListElement,
} from '../../../../faker'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList } from '../../../../types'
import { UeMedicalInvestigation } from './UeMedicalInvestigation'

const QUESTION_ID = 'list'

const question = fakeMedicalInvestigationListElement({
  id: QUESTION_ID,
  config: { list: [{ dateId: 'dateField' }] },
  value: { list: [{ date: fakeCertificateValue.date({ id: 'dateField', date: '1974-04-01' }) }] },
})[QUESTION_ID]

let testStore: EnhancedStore

const renderComponent = (props: ComponentProps<typeof UeMedicalInvestigation>) =>
  render(
    <Provider store={testStore}>
      <UeMedicalInvestigation {...props} />
    </Provider>
  )

beforeEach(() => {
  testStore = configureApplicationStore([certificateMiddleware])

  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...fakeDateElement({ id: 'dateQuestion', config: { id: 'some_date' }, value: { id: 'some_date', date: '1974-04-06' } }),
          [QUESTION_ID]: question,
        },
      })
    )
  )
})

it('Should get max date from validation', async () => {
  renderComponent({
    questionConfig: question.config as ConfigUeMedicalInvestigationList,
    config: (question.config as ConfigUeMedicalInvestigationList).list[0],
    disabled: false,
    error: false,
    onChange: vi.fn(),
    validation: [fakeMaxDateValidation({ questionId: 'dateQuestion', expression: 'some_date', id: 'dateField' })],
    validationErrors: [],
    value: (question.value as ValueMedicalInvestigationList).list[0],
  })

  await userEvent.click(screen.getByLabelText('Öppna kalendern'))

  expect(screen.getAllByLabelText(/Not available .* 1974/)).toHaveLength(29)
})
