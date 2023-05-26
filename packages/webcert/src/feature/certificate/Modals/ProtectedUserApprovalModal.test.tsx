import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { throwError } from '../../../store/error/errorActions'
import { renderWithStore } from '../../../utils/renderWithStore'
import ProtectedUserApprovalModal from './ProtectedUserApprovalModal'

const renderDefaultComponent = (showModal: boolean) => {
  return renderWithStore(<ProtectedUserApprovalModal showModal={showModal} preferenceKey={'KEY'} />)
}

describe('Create certificate from candidate modal', () => {
  it('shall render without crashing', () => {
    expect(() => renderDefaultComponent(true)).not.toThrow()
  })

  it('shall show modal if enabled', () => {
    renderDefaultComponent(true)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('shall not show modal if disabled', () => {
    renderDefaultComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shall set title for modal', () => {
    renderDefaultComponent(true)
    expect(screen.getByText('Användning av Webcert med skyddade personuppgifter')).toBeInTheDocument()
  })

  it('shall set body for modal', () => {
    renderDefaultComponent(true)
    expect(screen.getByText('Du har skyddade personuppgifter.')).toBeInTheDocument()
  })

  it('shall show checkbox in modal', () => {
    renderDefaultComponent(true)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shall disable confirm button if checkbox is unchecked', () => {
    renderDefaultComponent(true)
    expect(screen.getByText('Till Webcert')).toBeDisabled()
  })

  it('shall enable confirm button if checkbox is checked', async () => {
    renderDefaultComponent(true)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('Till Webcert')).toBeEnabled()
  })

  it('shall dispatch error if cancel button is pressed', async () => {
    const { getCalledActions } = renderDefaultComponent(true)
    await userEvent.click(screen.getByText('Avbryt'))
    expect(getCalledActions()).toContainEqual({
      type: throwError.type,
      payload: { errorCode: 'NOT_APPROVED_PROTECTED_PERSON_AGREEMENT', type: 'ROUTE' },
    })
  })
})
