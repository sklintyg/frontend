import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { act } from 'react-dom/test-utils'
import { server, waitForRequest } from '../../../mocks/server'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { fakeUser } from '../../../utils/fake/fakeUser'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ModifyPatientTableColumns } from './patientSickLeaves/ModifyPatientTableColumns'

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
    const { user } = renderWithRouter(<ModifyPatientTableColumns />)

    await user.click(await screen.findByRole('button'))

    expect(screen.getByLabelText<HTMLInputElement>('Slutdatum')).toBeChecked()

    await user.click(screen.getByLabelText('Slutdatum'))

    expect(screen.getByLabelText<HTMLInputElement>('Slutdatum')).not.toBeChecked()
  }, 20000)

  it('Should save column visibility changes', async () => {
    const { user } = renderWithRouter(<ModifyPatientTableColumns />)

    const pendingRequest = waitForRequest('POST', '/api/user/preferences')

    await user.click(await screen.findByRole('button'))
    await user.click(screen.getByLabelText('Slutdatum'))

    const request = await act(() => pendingRequest)

    expect(await request.json()).toMatchObject({
      patientTableColumns: Object.values(PatientColumn)
        .map((name) => `${name}:${name === 'Slutdatum' ? '0' : '1'}`)
        .join(';'),
    })
  }, 20000)
})

describe('position', () => {
  function getOptionByKey(key: string) {
    return screen.getAllByRole('option').find((element) => element.getAttribute('data-key') === key)
  }

  it('Should be possible to move column up', async () => {
    const { user } = renderWithRouter(<ModifyPatientTableColumns />)
    await user.click(await screen.findByRole('button'))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Diagnos/er')

    await user.click(screen.getByRole('button', { name: 'Flytta upp Grad' }))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Intygstyp')
  })

  it('Should be possible to move column down', async () => {
    const { user } = renderWithRouter(<ModifyPatientTableColumns />)
    await user.click(await screen.findByRole('button'))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Diagnos/er')

    await user.click(screen.getByLabelText('Flytta ner Grad'))

    expect(getOptionByKey('Grad')?.previousElementSibling?.getAttribute('data-key')).toBe('Startdatum')
  })
})
