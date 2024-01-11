import {
  Certificate,
  CertificateDataValidationType,
  CertificateDataValueType,
  fakeCertificate,
  fakeCertificateDataValidation,
  fakeRadioBooleanElement,
  fakeTextAreaElement,
} from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import {
  autoSaveCertificate,
  hideCertificateDataElement,
  showCertificateDataElement,
  updateCertificate,
  validateCertificate,
  validateCertificateInFrontEnd,
} from './certificateActions'
import { certificateMiddleware } from './certificateMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'

describe('Test certificate frontend validation', () => {
  let testStore: EnhancedStore

  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle Validate certificates in frontend', () => {
    describe('Show validation', () => {
      const showValidation = (selected: boolean, visible: boolean): Certificate =>
        fakeCertificate({
          data: {
            ...fakeRadioBooleanElement({
              id: '1.1',
              value: {
                type: CertificateDataValueType.BOOLEAN,
                selected,
                id: 'haveValue',
              },
            }),
            ...fakeTextAreaElement({
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
          },
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

      it('should trigger another frontend validation if the element is hidden', async () => {
        const certificate = showValidation(false, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is shown', async () => {
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
          data: {
            ...fakeRadioBooleanElement({
              id: '1.1',
              value: {
                type: CertificateDataValueType.BOOLEAN,
                selected,
                id: 'haveValue',
              },
            }),
            ...fakeTextAreaElement({
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
          },
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

      it('should trigger another frontend validation if the element is visible', async () => {
        const certificate = hideValidation(true, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is shown', async () => {
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
          data: {
            ...fakeRadioBooleanElement({
              id: '1.1',
              value: {
                type: CertificateDataValueType.BOOLEAN,
                selected,
                id: 'haveValue',
              },
            }),
            ...fakeTextAreaElement({
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
          },
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
        const certificate = showAndHideValidation(false, true)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(1)
        expect(showCertificateDataElementAction.length).toBe(0)
      })
    })
  })

  describe('Show and Hide validation', () => {
    const autoFillValidation = (selected: boolean, currentValue?: boolean): Certificate =>
      fakeCertificate({
        data: {
          ...fakeRadioBooleanElement({
            id: '1.1',
            value: {
              type: CertificateDataValueType.BOOLEAN,
              selected,
              id: 'haveValue',
            },
          }),
          ...fakeRadioBooleanElement({
            id: '1.2',
            value: {
              type: CertificateDataValueType.BOOLEAN,
              selected: currentValue,
              id: 'myValue',
            },
            validation: [
              fakeCertificateDataValidation({
                questionId: '1.1',
                type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
                expression: '$haveValue',
                fillValue: {
                  type: CertificateDataValueType.BOOLEAN,
                  selected: true,
                  id: 'myValue',
                },
              }),
              fakeCertificateDataValidation({
                questionId: '1.1',
                type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
                expression: '!$haveValue',
                fillValue: {
                  type: CertificateDataValueType.BOOLEAN,
                  selected: false,
                  id: 'myValue',
                },
              }),
            ],
          }),
        },
      })

    it('should update state with autofill value true', async () => {
      const certificate = autoFillValidation(true)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

      expect(testStore.getState().ui.uiCertificate.certificate.data['1.2'].value.selected).toBe(true)
    })

    it('should update state with autofill value false', async () => {
      const certificate = autoFillValidation(false)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

      expect(testStore.getState().ui.uiCertificate.certificate.data['1.2'].value.selected).toBe(false)
    })

    it('should trigger another frontend validation if the element is autofilled', async () => {
      const certificate = autoFillValidation(true)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

      const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
      expect(numberOfValidateCertificateInFrontend.length).toBe(2)
      expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
      expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
    })

    it('should not trigger another frontend validation if the element already has the autofill value', async () => {
      const certificate = autoFillValidation(true, true)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

      const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
      expect(numberOfValidateCertificateInFrontend.length).toBe(1)
      expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
    })

    it('should trigger autoSave if the element is autofilled', async () => {
      const certificate = autoFillValidation(true)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

      const numberOfAutoSaveCertificate = dispatchedActions.filter((action) => autoSaveCertificate.match(action))
      expect(numberOfAutoSaveCertificate.length).toBe(1)
    })

    it('should trigger validate if the element is autofilled', async () => {
      const certificate = autoFillValidation(true)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

      const numberOfValidateCertificate = dispatchedActions.filter((action) => validateCertificate.match(action))
      expect(numberOfValidateCertificate.length).toBe(1)
    })
  })
})
