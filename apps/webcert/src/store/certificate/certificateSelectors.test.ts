import { fakeCategoryElement, fakeCertificate, fakeCertificateValidationError, fakeTextFieldElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import faker from 'faker'
import { expect, it, describe, beforeEach } from 'vitest'
import { showValidationErrors, updateCertificate } from './certificateActions'
import { certificateMiddleware } from './certificateMiddleware'
import { getCertificateDataElements, getVisibleValidationErrors } from './certificateSelectors'
import { configureApplicationStore } from '../configureApplicationStore'

let testStore: EnhancedStore

describe('certificateSelectors', () => {
  describe('getCertificateDataElements', () => {
    beforeEach(() => {
      testStore = configureApplicationStore([certificateMiddleware])

      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeTextFieldElement({ id: '1', parent: 'funktionsnedsattning', index: 3 }),
              ...fakeTextFieldElement({ id: '1.2', parent: '1', index: 5 }),
              ...fakeTextFieldElement({ id: '1.1', parent: '1', index: 4 }),
              ...fakeTextFieldElement({ id: '1.3', parent: '1', index: 6 }),
              ...fakeTextFieldElement({ id: '28', parent: 'sysselsattning', index: 1 }),
              ...fakeCategoryElement({ id: 'funktionsnedsattning', index: 2 }),
              ...fakeCategoryElement({ id: 'sysselsattning', index: 0 }),
            },
          })
        )
      )
    })

    it('should group sub questions with parent question', () => {
      const elements = getCertificateDataElements(testStore.getState())

      expect(elements.length).toBe(4)
    })

    it('should not group categories with sub questions', () => {
      const elements = getCertificateDataElements(testStore.getState())

      expect(elements[0].subQuestionIds).toEqual([])
    })

    it('should sort categories, questions and sub questions by index', () => {
      const elements = getCertificateDataElements(testStore.getState())
      const ids = elements.map((el) => [el.id, ...el.subQuestionIds]).reduce((acc, curr) => acc.concat(curr), [])

      expect(ids).toEqual(['sysselsattning', '28', 'funktionsnedsattning', '1', '1.1', '1.2', '1.3'])
    })
  })

  describe('getVisibleValidationErrors', () => {
    beforeEach(() => {
      faker.seed(12345)
      testStore = configureApplicationStore([certificateMiddleware])

      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeTextFieldElement({
                id: '1',
                validationErrors: faker.datatype.array(4).map((_, index) => fakeCertificateValidationError({ id: `server-1-${index}` })),
              }),
              ...fakeTextFieldElement({
                id: '2',
                validationErrors: faker.datatype.array(6).map((_, index) => fakeCertificateValidationError({ id: `server-2-${index}` })),
              }),
            },
          })
        )
      )
    })

    it('Should return list of server-side errors', () => {
      testStore.dispatch(showValidationErrors())

      expect(getVisibleValidationErrors('1')(testStore.getState())).toMatchObject([
        { id: 'server-1-0' },
        { id: 'server-1-1' },
        { id: 'server-1-2' },
        { id: 'server-1-3' },
      ])
    })

    it('Should return empty list if showValidationErrors is false', () => {
      expect(getVisibleValidationErrors('1')(testStore.getState()).length).toEqual(0)
    })

    it('Should ignore showValidationErrors for errors with "showAlways" set to true', () => {
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeTextFieldElement({
                id: '4',
                validationErrors: faker.datatype
                  .array(2)
                  .map((_, index) => fakeCertificateValidationError({ id: `server-4-${index}`, showAlways: true })),
              }),
            },
          })
        )
      )
      expect(getVisibleValidationErrors('4')(testStore.getState()).length).toEqual(2)
    })

    it('Should return unique errors based of type', () => {
      testStore.dispatch(showValidationErrors())
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeTextFieldElement({
                id: '3',
                validationErrors: faker.datatype
                  .array(5)
                  .map((_, index) => fakeCertificateValidationError({ id: `server-3-${index}`, type: 'SAME_TYPE', field: 'SAME_FIELD' })),
              }),
            },
          })
        )
      )
      expect(getVisibleValidationErrors('3')(testStore.getState()).length).toEqual(1)
    })

    it('Should match return all errors if field is empty string', () => {
      testStore.dispatch(showValidationErrors())
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeTextFieldElement({
                id: 'id',
                validationErrors: faker.datatype.array(4).map((field, index) =>
                  fakeCertificateValidationError({
                    id: `server-1-${index}`,
                    field: index % 2 === 0 ? '' : `${field}`,
                  })
                ),
              }),
            },
          })
        )
      )

      expect(getVisibleValidationErrors('id', 'unavailable')(testStore.getState())).toMatchObject([
        { id: 'server-1-0', field: '' },
        { id: 'server-1-2', field: '' },
      ])
    })

    it('Should partially and exact match on field', () => {
      testStore.dispatch(showValidationErrors())
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeTextFieldElement({
                id: 'id',
                validationErrors: faker.datatype.array(4).map((field, index) =>
                  fakeCertificateValidationError({
                    id: `server-1-${index}`,
                    field: 'field',
                  })
                ),
              }),
            },
          })
        )
      )

      expect(getVisibleValidationErrors('id', 'field')(testStore.getState()).length).toBe(4)
      expect(getVisibleValidationErrors('id', 'ie')(testStore.getState()).length).toBe(4)
      expect(getVisibleValidationErrors('id', 'ld')(testStore.getState()).length).toBe(4)
      expect(getVisibleValidationErrors('id', 'ld')(testStore.getState()).length).toBe(4)
    })
  })
})
