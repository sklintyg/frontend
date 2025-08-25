import { fakeCertificate, fakeQuestion, fakeRadioBooleanElement, fakeTextAreaElement } from '../faker'
import type { ValueBoolean, ValueText } from '../types/certificate'
import { QuestionType } from '../types/question'
import { getCertificateToSave, hasUnhandledComplementQuestions } from './certificateUtils'

describe('Clean certificate before saving', () => {
  // const certificate = getCertificate()

  it('Should clear boolean value for element that is not visible', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({ id: '1.1', visible: false, value: { selected: true } }),
      },
    })

    const clearedCertificate = getCertificateToSave(certificate)

    expect(clearedCertificate.data['1.1'].value).toBeNull()
  })

  it('Should not clear boolean value for element that is visible', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({ id: '1.1', visible: true, value: { selected: true } }),
      },
    })

    const clearedCertificate = getCertificateToSave(certificate)

    expect((clearedCertificate.data['1.1'].value as ValueBoolean).selected).toEqual(true)
  })

  it('Clean text value for element that is not visible', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeTextAreaElement({ id: '1.2', visible: false, value: { text: 'Has text value' } }),
      },
    })

    const clearedCertificate = getCertificateToSave(certificate)

    expect(clearedCertificate.data['1.2'].value).toBeNull()
  })

  it('Clean text value for element that is visible', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeTextAreaElement({ id: '1.2', visible: true, value: { text: 'Has text value' } }),
      },
    })

    const clearedCertificate = getCertificateToSave(certificate)

    expect((clearedCertificate.data['1.2'].value as ValueText).text).toEqual('Has text value')
  })
})

describe('hasUnhandledComplementQuestions', () => {
  it('returns true if unhandled complement questions', () => {
    const questions = fakeQuestion({ type: QuestionType.COMPLEMENT })
    const actual = hasUnhandledComplementQuestions([questions])
    expect(actual).toBe(true)
  })

  it('returns false if handled complement questions', () => {
    const questions = fakeQuestion({ handled: true, type: QuestionType.COMPLEMENT })
    const actual = hasUnhandledComplementQuestions([questions])
    expect(actual).toBe(false)
  })

  it('returns false if no questions', () => {
    const actual = hasUnhandledComplementQuestions([])
    expect(actual).toBe(false)
  })

  it('returns false if other types than complement', () => {
    const questions = [
      fakeQuestion({ type: QuestionType.OTHER }),
      fakeQuestion({ type: QuestionType.MISSING }),
      fakeQuestion({ type: QuestionType.CONTACT }),
      fakeQuestion({ type: QuestionType.COORDINATION }),
    ]
    const actual = hasUnhandledComplementQuestions(questions)
    expect(actual).toBe(false)
  })
})
