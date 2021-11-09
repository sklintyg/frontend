import MockAdapter from 'axios-mock-adapter'
import { Certificate, SigningMethod } from '@frontend/common'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import {
  answerComplementCertificate,
  complementCertificate,
  complementCertificateSuccess,
  ComplementCertificateSuccess,
  createCertificateFromCandidate,
  CreateCertificateFromCandidateSuccess,
  hideSpinner,
  SigningData,
  startSignCertificate,
  updateCertificate,
  validateCertificateInFrontEnd,
} from '../certificate/certificateActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { certificateMiddleware } from './certificateMiddleware'
import { updateUser } from '../user/userActions'
import { CertificateDataElementStyleEnum, CertificateDataValidationType, CertificateDataValueType } from '@frontend/common/src'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test certificate middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, certificateMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle ComplementCertificate', () => {
    it('shall update certificate when complemented', async () => {
      const certificateToComplement = getCertificate('originalCertificateId')
      const expectedCertificate = getCertificate('newCertificateId')
      const complementCertificateSuccess = { certificate: expectedCertificate } as ComplementCertificateSuccess
      fakeAxios.onPost(`/api/certificate/${certificateToComplement.metadata.id}/complement`).reply(200, complementCertificateSuccess)
      testStore.dispatch(updateCertificate(certificateToComplement))

      testStore.dispatch(complementCertificate(''))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
    })
  })

  describe('Handle ComplementCertificateSuccess', () => {
    beforeEach(() => {
      fakeAxios = new MockAdapter(axios)
      testStore = configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, certificateMiddleware),
      })
    })

    it('shall update certificate on success', async () => {
      const certificateToComplement = getCertificate('id')

      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement }))
      await flushPromises()
      const updateCertificateDispatchFound = dispatchedActions.some((action) => updateCertificate.match(action))

      expect(updateCertificateDispatchFound).toBeTruthy()
    })

    it('shall validate certificate on success', async () => {
      const certificateToComplement = getCertificate('id')

      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement }))
      await flushPromises()

      expect(fakeAxios.history.post.some((req) => req.url?.includes('validate'))).toBeTruthy()
    })

    it('shall hide spinner on success', async () => {
      const certificateToComplement = getCertificate('id')

      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement }))
      await flushPromises()
      const updateCertificateDispatchFound = dispatchedActions.some((action) => hideSpinner.match(action))

      expect(updateCertificateDispatchFound).toBeTruthy()
    })

    it('shall get certificate events on success', async () => {
      const certificateToComplement = getCertificate('id')

      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement }))
      await flushPromises()

      expect(fakeAxios.history.get.some((req) => req.url?.includes('events'))).toBeTruthy()
    })
  })

  describe('Handle AnswerComplementCertificate', () => {
    it('shall update certificate when complemented', async () => {
      const certificateToComplement = getCertificate('originalCertificateId')
      const expectedCertificate = getCertificate('updatedCertificateId')
      const complementCertificateSuccess = { certificate: expectedCertificate } as ComplementCertificateSuccess
      fakeAxios.onPost(`/api/certificate/${certificateToComplement.metadata.id}/answercomplement`).reply(200, complementCertificateSuccess)
      testStore.dispatch(updateCertificate(certificateToComplement))

      testStore.dispatch(answerComplementCertificate('Vi svarar denna komplettering med ett meddelande'))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
    })
  })

  describe('Handle startSigningCertificate', () => {
    it('shall update signing data when successfully starting the signing process', async () => {
      const expectedSigningData = { id: 'testId', signRequest: 'signRequest', actionUrl: 'actionUrl' } as SigningData
      const certificate = getCertificate('id', 'lisjp', '2')
      setDefaultUser()
      testStore.dispatch(updateCertificate(certificate))

      fakeAxios
        .onPost(
          `/api/signature/${certificate.metadata.type}/${certificate.metadata.id}/${certificate.metadata.version}/signeringshash/SIGN_SERVICE`
        )
        .reply(200, expectedSigningData)

      testStore.dispatch(startSignCertificate)

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.signingData).toEqual(expectedSigningData)
    })

    it('shall make a signing request to DSS when users signing method is DSS', async () => {
      const certificate = getCertificate('id', 'lisjp', '2')
      setDefaultUser()

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(startSignCertificate)

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })

  describe('Handle CreateCertificateFromCandidate', () => {
    it('shall return certificate filled in certificate from candidate', async () => {
      const expectedCertificate = getCertificate('newCertificateId', 'ag7804')
      const createCertificateFromCandidateSuccess: CreateCertificateFromCandidateSuccess = {
        certificateId: expectedCertificate.metadata.id,
      }
      fakeAxios.onPost(`/api/certificate/${expectedCertificate.metadata.id}/candidate`).reply(200, createCertificateFromCandidateSuccess)
      testStore.dispatch(updateCertificate(expectedCertificate))

      testStore.dispatch(createCertificateFromCandidate())

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })

  describe('Handle highlight certificate data element', () => {
    it('shall highlight certificate data element', async () => {
      const certificate = getCertificateWithHiglightValidation(true)

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(validateCertificateInFrontEnd(certificate.data[0]))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.data[0].style).toEqual(CertificateDataElementStyleEnum.HIGHLIGHTED)
    })

    it('shall unstyle certificate data element', async () => {
      const certificate = getCertificateWithHiglightValidation(false)
      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(validateCertificateInFrontEnd(certificate.data[0]))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.data[0].style).toEqual(CertificateDataElementStyleEnum.NORMAL)
    })
  })

  const setDefaultUser = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    testStore.dispatch(updateUser({ signingMethod: SigningMethod.DSS }))
  }
})

const getCertificate = (id: string, type?: string, version?: string): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: { id, type, version },
    links: [],
  }
}

const getCertificateWithHiglightValidation = (selected: boolean): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: { id: 'id', type: 'type', version: 'version' },
    data: [
      {
        id: '0',
        readOnly: false,
        parent: '0',
        index: 1,
        visible: true,
        mandatory: false,
        config: {
          text: '',
          description: '',
          type: null,
        },
        value: {
          type: CertificateDataValueType.BOOLEAN,
          selected: selected,
        },
        validation: [
          {
            questionId: '0',
            type: CertificateDataValidationType.HIGHLIGHT_VALIDATION,
            expression: '$0',
          },
        ],
      },
    ],
    links: [],
  }
}
