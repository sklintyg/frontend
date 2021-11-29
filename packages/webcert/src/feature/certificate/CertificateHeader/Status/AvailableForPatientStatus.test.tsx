import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AvailableForPatientStatus from './AvailableForPatientStatus'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { CertificateStatus } from '@frontend/common/src'

it('displays that the certificate is available for the patient', async () => {
  renderComponent('')

  expect(screen.getByText(/intyget är tillgängligt för patienten/i, { exact: false })).toBeInTheDocument()
  userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))

  expect(
    screen.getByRole('heading', {
      name: /intyget är tillgängligt för patienten/i,
    })
  ).toBeInTheDocument()
  expect(screen.getByText(/intyget är tillgängligt för patienten i mina intyg, som nås via/i)).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /stäng/i }))
  expect(screen.queryByText(/intyget är tillgängligt för patienten i mina intyg, som nås via/i)).not.toBeInTheDocument()
})

it('shall render specific text in modal if certificate is lisjp', () => {
  renderComponent('lisjp')

  userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))
  expect(
    screen.queryByText('Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.', { exact: false })
  ).toBeInTheDocument()
})

it('shall not render specific text in modal if certificate is not lisjp', () => {
  renderComponent('ag7804')
  userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))
  expect(
    screen.queryByText('Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.', { exact: false })
  ).not.toBeInTheDocument()
})

it('doesnt render anything', async () => {
  const spy = jest.spyOn(utils, 'isSigned')

  spy.mockReturnValue(false)

  // @ts-expect-error we don't need to send all props
  render(<AvailableForPatientStatus />)

  expect(screen.queryByText(/intyget är tillgängligt för patienten/i)).not.toBeInTheDocument()
})

const renderComponent = (type: string) => {
  render(
    <Provider store={store}>
      <AvailableForPatientStatus certificateMetadata={createMetadata(type)} />
    </Provider>
  )
}

const createMetadata = (type: string) => {
  return {
    type: type,
    status: CertificateStatus.SIGNED,
  }
}
