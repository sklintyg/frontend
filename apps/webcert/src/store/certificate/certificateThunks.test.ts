import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { fakeCertificate } from '../../faker'
import { getCertificateToSave } from '../../utils'
import { isFunctionDisabled } from '../api/requestSlice'
import store from '../store'
import { resetCertificateState, toggleCertificateFunctionDisabler, updateCertificate } from './certificateActions'
import { getCertificate, getCertificateVersion } from './certificateSelectors'
import { autoSaveCertificate } from './certificateThunks'

describe('certificateThunks', () => {
  let fakeAxios: MockAdapter

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
  })

  afterEach(() => {
    fakeAxios.reset()
    store.dispatch(resetCertificateState())
  })

  describe('autoSaveCertificate', () => {
    const mockCertificate = fakeCertificate({
      metadata: {
        id: 'test-certificate-id',
        version: 1,
      },
    })

    it('should update certificate version on successful autosave', async () => {
      store.dispatch(updateCertificate(mockCertificate))
      const initialVersion = getCertificateVersion(store.getState())

      const expectedResponse = { version: 2 }
      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).reply(200, expectedResponse)

      await store.dispatch(autoSaveCertificate(mockCertificate))

      const updatedVersion = getCertificateVersion(store.getState())
      expect(updatedVersion).toBe(2)
      expect(updatedVersion).not.toBe(initialVersion)
    })

    it('should make PUT request to correct endpoint with certificate data', async () => {
      const expectedResponse = { version: 2 }
      const expectedRequestData = getCertificateToSave(mockCertificate)

      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).reply(200, expectedResponse)

      await store.dispatch(autoSaveCertificate(mockCertificate))

      expect(fakeAxios.history.put).toHaveLength(1)
      expect(fakeAxios.history.put[0].url).toBe(`/api/certificate/${mockCertificate.metadata.id}`)
      expect(JSON.parse(fakeAxios.history.put[0].data)).toEqual(expectedRequestData)
    })

    it('should maintain certificate state on successful autosave', async () => {
      store.dispatch(updateCertificate(mockCertificate))
      const initialCertificate = getCertificate(store.getState())

      const expectedResponse = { version: 2 }
      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).reply(200, expectedResponse)

      await store.dispatch(autoSaveCertificate(mockCertificate))

      const updatedCertificate = getCertificate(store.getState())
      expect(updatedCertificate).toBeDefined()
      expect(updatedCertificate?.metadata.version).toBe(2)
      expect(updatedCertificate?.metadata.id).toBe(initialCertificate?.metadata.id)
    })

    it('should not update certificate version when request fails', async () => {
      store.dispatch(updateCertificate(mockCertificate))
      const initialVersion = getCertificateVersion(store.getState())

      const errorResponse = { message: 'Internal Server Error', errorCode: 'INTERNAL_ERROR' }
      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).reply(500, errorResponse)

      try {
        await store.dispatch(autoSaveCertificate(mockCertificate))
      } catch {
        // Expected to fail
      }

      const versionAfterError = getCertificateVersion(store.getState())
      expect(versionAfterError).toBe(initialVersion)
    })

    it('should handle network errors gracefully without affecting state', async () => {
      store.dispatch(updateCertificate(mockCertificate))
      const initialCertificate = getCertificate(store.getState())

      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).networkError()

      try {
        await store.dispatch(autoSaveCertificate(mockCertificate))
      } catch {
        // Expected to fail
      }

      const certificateAfterError = getCertificate(store.getState())
      expect(certificateAfterError?.metadata.version).toBe(initialCertificate?.metadata.version)
    })

    it('should manage function disabler state during request', async () => {
      store.dispatch(updateCertificate(mockCertificate))

      const expectedResponse = { version: 2 }

      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).reply(() => [200, expectedResponse])

      const asyncThunk = store.dispatch(autoSaveCertificate(mockCertificate))

      expect(isFunctionDisabled(toggleCertificateFunctionDisabler.type)(store.getState())).toBe(true)

      await asyncThunk

      expect(isFunctionDisabled(toggleCertificateFunctionDisabler.type)(store.getState())).toBe(false)
    })

    it('should handle timeout errors without affecting state', async () => {
      store.dispatch(updateCertificate(mockCertificate))
      const initialVersion = getCertificateVersion(store.getState())

      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).timeout()

      try {
        await store.dispatch(autoSaveCertificate(mockCertificate))
      } catch {
        // Expected to fail
      }

      const versionAfterTimeout = getCertificateVersion(store.getState())
      expect(versionAfterTimeout).toBe(initialVersion)
    })

    it('should use correct HTTP method (PUT)', async () => {
      store.dispatch(updateCertificate(mockCertificate))

      const expectedResponse = { version: 2 }
      fakeAxios.onPut(`/api/certificate/${mockCertificate.metadata.id}`).reply(200, expectedResponse)

      await store.dispatch(autoSaveCertificate(mockCertificate))

      expect(fakeAxios.history.put).toHaveLength(1)
      expect(fakeAxios.history.get).toHaveLength(0)
      expect(fakeAxios.history.post).toHaveLength(0)
      expect(fakeAxios.history.delete).toHaveLength(0)

      expect(getCertificateVersion(store.getState())).toBe(2)
    })
  })
})
