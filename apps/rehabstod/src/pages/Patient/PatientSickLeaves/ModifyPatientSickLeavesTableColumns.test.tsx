import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { act } from 'react-dom/test-utils'
import { server, waitForRequest } from '../../../mocks/server'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { fakeUser } from '../../../utils/fake/fakeUser'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ModifyPatientSickLeavesTableColumns } from './ModifyPatientSickLeavesTableColumns'

beforeEach(() => {
  server.use(
    rest.get('/api/user', (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json(
          fakeUser({
            preferences: {
              patientTableColumns: Object.values(PatientColumn)
                .map((name) => `${name}:1`)
                .join(';'),
            },
          })
        )
      )
    )
  )
})

describe('vibility', () => {
  it('Should be possible to hide visible columns', async () => {
    const { user } = renderWithRouter(<ModifyPatientSickLeavesTableColumns />)

    await user.click(await screen.findByRole('button'))

    expect(screen.getByLabelText<HTMLInputElement>('Slutdatum').checked).toEqual(true)

    await user.click(screen.getByLabelText('Slutdatum'))

    expect(screen.getByLabelText<HTMLInputElement>('Slutdatum').checked).toEqual(false)
  })

  it('Should save column visibility changes', async () => {
    const { user } = renderWithRouter(<ModifyPatientSickLeavesTableColumns />)

    const pendingRequest = waitForRequest('POST', '/api/user/preferences')

    await user.click(await screen.findByRole('button'))
    await user.click(screen.getByLabelText('Slutdatum'))

    const request = await act(() => pendingRequest)

    expect(await request.json()).toMatchObject({
      patientTableColumns: Object.values(PatientColumn)
        .map((name) => `${name}:${name === 'Slutdatum' ? '0' : '1'}`)
        .join(';'),
    })
  })
})

describe('position', () => {
  function getOptionByKey(key: string) {
    return screen.getAllByRole('option').find((element) => element.getAttribute('data-key') === key)
  }

  it('Should be possible to move column up', async () => {
    const { user } = renderWithRouter(<ModifyPatientSickLeavesTableColumns />)
    await user.click(await screen.findByRole('button'))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Diagnos/er')

    await user.click(screen.getByRole('button', { name: 'Flytta upp Grad' }))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('#')
  })

  it('Should be possible to move column down', async () => {
    const { user } = renderWithRouter(<ModifyPatientSickLeavesTableColumns />)
    await user.click(await screen.findByRole('button'))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Diagnos/er')

    await user.click(screen.getByLabelText('Flytta ner Grad'))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Startdatum')
  })
})
