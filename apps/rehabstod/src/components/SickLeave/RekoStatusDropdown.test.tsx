import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { expect, it, describe, beforeEach } from 'vitest'
import { RekoStatusDropdown } from './RekoStatusDropdown'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'

const STATUS = { status: { id: 'REKO_1', name: 'REKO_2' } }
const PATIENT_ID = '191212121212'

const renderComponent = (endDate = new Date().toString()) =>
  renderWithRouter(<RekoStatusDropdown statusFromSickLeave={STATUS} patientId={PATIENT_ID} endDate={endDate} />)

describe('RekoStatusDropdown', () => {
  beforeEach(() => {
    server.use(
      rest.get('/api/sickleaves/filters', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            rekoStatusTypes: [
              { id: 'REKO_1', name: 'Ingen' },
              { id: 'REKO_2', name: 'Kontaktad' },
              { id: 'REKO_3', name: 'Uppföljning' },
            ],
          })
        )
      )
    )
  })

  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show reko status as title', async () => {
    renderComponent()
    expect(await screen.findByText(STATUS.status.name)).toBeInTheDocument()
  })

  it('should show options when opening dropdown', async () => {
    renderComponent()
    await userEvent.click(await screen.findByText(STATUS.status.name))
    expect(await screen.findByText('Ingen')).toBeInTheDocument()
    expect(await screen.findByText('Kontaktad')).toBeInTheDocument()
    expect(await screen.findByText('Uppföljning')).toBeInTheDocument()
  })

  it('should close dropdown when clicking on option', async () => {
    renderComponent()
    await userEvent.click(await screen.findByText(STATUS.status.name))
    await userEvent.click(screen.getByText('Ingen'))
    expect(await screen.findAllByRole('button')).toHaveLength(1)
  })

  it('should update dropdown text when clicking on option', async () => {
    renderComponent()
    await userEvent.click(await screen.findByText(STATUS.status.name))
    await userEvent.click(await screen.findByText('Uppföljning'))
    expect(await screen.findByText('Uppföljning')).toBeInTheDocument()
    expect(await screen.findAllByRole('button')).toHaveLength(1)
  })
})
