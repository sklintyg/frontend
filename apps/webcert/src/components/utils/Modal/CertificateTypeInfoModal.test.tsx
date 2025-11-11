import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { describe, expect, it, vi } from 'vitest'
import { fakePatient } from '../../../faker'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import type { CertificateTypeInfoModalData } from '../../../types'
import { CertificateTypeInfoModal } from './CertificateTypeInfoModal'

let testStore: EnhancedStore
let fakeAxios: MockAdapter

const mockModalData: CertificateTypeInfoModalData = {
  title: 'Test Modal Title',
  description: 'Test modal description with some information',
}

const patient = fakePatient()
const certificateType = 'lisjp'
const patientId = patient.personId.id

const renderComponent = (open: boolean, setOpen = vi.fn()) => {
  render(
    <Provider store={testStore}>
      <CertificateTypeInfoModal certificateType={certificateType} patientId={patientId} open={open} setOpen={setOpen} />
    </Provider>
  )
  return { setOpen }
}

describe('CertificateTypeInfoModal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
    fakeAxios = new MockAdapter(axios)
  })

  afterEach(() => {
    fakeAxios.restore()
  })

  it('should not render when open is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show loading state when modal opens', () => {
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, mockModalData)
    renderComponent(true)
    expect(screen.getByRole('heading', { name: 'Laddar...' })).toBeInTheDocument()
    expect(screen.getAllByText('Laddar...').length).toBeGreaterThan(0)
  })

  it('should fetch and display modal data when opened', async () => {
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, mockModalData)
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Test Modal Title')).toBeInTheDocument()
    })

    expect(screen.getByText('Test modal description with some information')).toBeInTheDocument()
  })

  it('should make API call with correct URL parameters', async () => {
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, mockModalData)
    renderComponent(true)

    await waitFor(() => {
      expect(fakeAxios.history.get[0].url).toEqual(`/api/certificate/type/modal/${certificateType}/${patientId}`)
    })
  })

  it('should close modal when close button is clicked', async () => {
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, mockModalData)
    const { setOpen } = renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Test Modal Title')).toBeInTheDocument()
    })

    const closeButton = screen.getByRole('button', { name: 'Stäng' })
    await userEvent.click(closeButton)

    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it('should handle API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(500)

    renderComponent(true)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch certificate type info modal', expect.any(Object))
    })

    consoleSpy.mockRestore()
  })

  it('should only fetch data once when modal is already loaded', async () => {
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, mockModalData)

    const { rerender } = render(
      <Provider store={testStore}>
        <CertificateTypeInfoModal certificateType={certificateType} patientId={patientId} open={true} setOpen={vi.fn()} />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Modal Title')).toBeInTheDocument()
    })

    // Rerender with same props
    rerender(
      <Provider store={testStore}>
        <CertificateTypeInfoModal certificateType={certificateType} patientId={patientId} open={true} setOpen={vi.fn()} />
      </Provider>
    )

    // Should only have made one API call
    expect(fakeAxios.history.get.length).toBe(1)
  })

  it('should reset modal data when closed and reopened', async () => {
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, mockModalData)

    const setOpen = vi.fn()
    const { rerender } = render(
      <Provider store={testStore}>
        <CertificateTypeInfoModal certificateType={certificateType} patientId={patientId} open={true} setOpen={setOpen} />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Modal Title')).toBeInTheDocument()
    })

    // Close the modal
    const closeButton = screen.getByRole('button', { name: 'Stäng' })
    await userEvent.click(closeButton)

    expect(setOpen).toHaveBeenCalledWith(false)

    // Reopen the modal
    rerender(
      <Provider store={testStore}>
        <CertificateTypeInfoModal certificateType={certificateType} patientId={patientId} open={false} setOpen={setOpen} />
      </Provider>
    )

    rerender(
      <Provider store={testStore}>
        <CertificateTypeInfoModal certificateType={certificateType} patientId={patientId} open={true} setOpen={setOpen} />
      </Provider>
    )

    // Should fetch data again
    await waitFor(() => {
      expect(fakeAxios.history.get.length).toBe(2)
    })
  })

  it('should display title from API response', async () => {
    const customData = { title: 'Custom Title', description: 'Custom description' }
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, customData)

    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })
  })

  it('should display description from API response', async () => {
    const customData = { title: 'Title', description: 'This is a custom description with more details' }
    fakeAxios.onGet(`/api/certificate/type/modal/${certificateType}/${patientId}`).reply(200, customData)

    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('This is a custom description with more details')).toBeInTheDocument()
    })
  })
})
