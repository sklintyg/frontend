import {
  Certificate,
  CertificateDataValidationType,
  CertificateDataValueType,
  fakeCertificate,
  fakeCertificateData,
  fakeCertificateDataValidation,
  fakeRadioBooleanElement,
  fakeTextAreaElement,
} from '@frontend/common'
import {
  hideCertificateDataElement,
  showCertificateDataElement,
  updateCertificate,
  validateCertificateInFrontEnd,
} from './certificateActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import { certificateMiddleware } from './certificateMiddleware'

describe('Test certificate frontend validation', () => {
  let testStore: EnhancedStore

  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, certificateMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle Validate certificates in frontend', () => {
    describe('Show validation', () => {
      const showValidation = (selected: boolean, visible: boolean): Certificate =>
        fakeCertificate({
          data: fakeCertificateData([
            fakeRadioBooleanElement({
              id: '1.1',
              value: {
                type: CertificateDataValueType.BOOLEAN,
                selected,
                id: 'haveValue',
              },
            }),
            fakeTextAreaElement({
              id: '1.2',
              visible,
              validation: [
                fakeCertificateDataValidation({
                  questionId: '1.1',
                  type: CertificateDataValidationType.SHOW_VALIDATION,
                  expression: '$haveValue',
                }),
              ],
            }),
          ]),
        })

      it('should throw hide action when hidden', async () => {
        const certificate = showValidation(false, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.find((action) => hideCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction && hideCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should throw show action when hidden', async () => {
        const certificate = showValidation(true, false)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const showCertificateDataElementAction = dispatchedActions.find((action) => showCertificateDataElement.match(action))
        expect(showCertificateDataElementAction && showCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is hidden ', async () => {
        const certificate = showValidation(false, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is shown ', async () => {
        const certificate = showValidation(true, false)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should throw one show action when two show validations is present that validates true', async () => {
        const certificate = showValidation(true, false)
        certificate.data['1.2'].validation = [
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ]
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })

      it('should throw one show action when two show validations is present and one validates false and one true', async () => {
        const certificate = showValidation(true, false)
        certificate.data['1.2'].validation = [
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ]
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })
    })

    describe('Hide Validation', () => {
      const hideValidation = (selected: boolean, visible: boolean): Certificate =>
        fakeCertificate({
          data: fakeCertificateData([
            fakeRadioBooleanElement({
              id: '1.1',
              value: {
                type: CertificateDataValueType.BOOLEAN,
                selected,
                id: 'haveValue',
              },
            }),
            fakeTextAreaElement({
              id: '1.2',
              visible,
              validation: [
                fakeCertificateDataValidation({
                  questionId: '1.1',
                  type: CertificateDataValidationType.HIDE_VALIDATION,
                  expression: '$haveValue',
                }),
              ],
            }),
          ]),
        })

      it('should throw hide action when visible', async () => {
        const certificate = hideValidation(true, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.find((action) => hideCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction && hideCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should throw unhide action when hidden', async () => {
        const certificate = hideValidation(false, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const showCertificateDataElementAction = dispatchedActions.find((action) => showCertificateDataElement.match(action))
        expect(showCertificateDataElementAction && showCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is visible ', async () => {
        const certificate = hideValidation(true, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is shown ', async () => {
        const certificate = hideValidation(true, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should throw show action when two hide validations is present and validates false', async () => {
        const certificate = hideValidation(true, false)
        certificate.data['1.2'].validation = [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
        ]
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })
    })

    describe('Show and Hide validation', () => {
      const showAndHideValidation = (selected: boolean, visible: boolean): Certificate =>
        fakeCertificate({
          data: fakeCertificateData([
            fakeRadioBooleanElement({
              id: '1.1',
              value: {
                type: CertificateDataValueType.BOOLEAN,
                selected,
                id: 'haveValue',
              },
            }),
            fakeTextAreaElement({
              id: '1.2',
              visible,
              validation: [
                fakeCertificateDataValidation({
                  questionId: '1.1',
                  type: CertificateDataValidationType.HIDE_VALIDATION,
                  expression: '$haveValue',
                }),
                fakeCertificateDataValidation({
                  questionId: '1.1',
                  type: CertificateDataValidationType.SHOW_VALIDATION,
                  expression: '$haveValue',
                }),
              ],
            }),
          ]),
        })

      it('should throw hide action when both hide and show is present and validates true', async () => {
        const certificate = showAndHideValidation(true, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(1)
        expect(showCertificateDataElementAction.length).toBe(0)
      })

      it('should throw hide action when both hide and show is present but only hide validates true', async () => {
        const certificate = showAndHideValidation(false, true)
        certificate.data['1.2'].validation = [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ]
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(1)
        expect(showCertificateDataElementAction.length).toBe(0)
      })

      it('should throw show action when both hide and show is present but only show validates true', async () => {
        const certificate = showAndHideValidation(true, false)
        certificate.data['1.2'].validation = [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ]
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })

      it('should throw hide action when both hide and show is present and validates false', async () => {
        const certificate = showAndHideValidation(false, false)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })
    })
  })
})
