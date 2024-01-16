import { ValueBoolean, ValueText } from '../types/certificate'
import { QuestionType } from '../types/question'
import { getCertificateToSave, hasUnhandledComplementQuestions } from './certificateUtils'
import { getCertificate, getQuestions } from './test/certificateTestUtil'

describe('Clean certificate before saving', () => {
  const certificate = getCertificate()

  it('Should clear boolean value for element that is not visible', () => {
    const booleanValue = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true
    certificate.data['1.1'].visible = false

    const clearedCertificate = getCertificateToSave(certificate)

    expect(clearedCertificate.data['1.1'].value).toBeNull()
  })

  it('Should not clear boolean value for element that is visible', () => {
    const booleanValue = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true
    certificate.data['1.1'].visible = true

    const clearedCertificate = getCertificateToSave(certificate)

    expect((clearedCertificate.data['1.1'].value as ValueBoolean).selected).toEqual(true)
  })

  it('Clean text value for element that is not visible', () => {
    const textValue = certificate.data['1.2'].value as ValueText
    textValue.text = 'Has text value'
    certificate.data['1.2'].visible = false

    const clearedCertificate = getCertificateToSave(certificate)

    expect(clearedCertificate.data['1.2'].value).toBeNull()
  })

  it('Clean text value for element that is visible', () => {
    const textValue = certificate.data['1.2'].value as ValueText
    textValue.text = 'Has text value'
    certificate.data['1.2'].visible = true

    const clearedCertificate = getCertificateToSave(certificate)

    expect((clearedCertificate.data['1.2'].value as ValueText).text).toEqual('Has text value')
  })
})

describe('hasUnhandledComplementQuestions', () => {
  it('returns true if unhandled complement questions', () => {
    const questions = getQuestions(false, QuestionType.COMPLEMENT)
    const actual = hasUnhandledComplementQuestions(questions)
    expect(actual).toBe(true)
  })

  it('returns false if handled complement questions', () => {
    const questions = getQuestions(true, QuestionType.COMPLEMENT)
    const actual = hasUnhandledComplementQuestions(questions)
    expect(actual).toBe(false)
  })

  it('returns false if no questions', () => {
    const actual = hasUnhandledComplementQuestions([])
    expect(actual).toBe(false)
  })

  it('returns false if other types than complement', () => {
    const questions = [
      ...getQuestions(false, QuestionType.OTHER),
      ...getQuestions(false, QuestionType.MISSING),
      ...getQuestions(false, QuestionType.CONTACT),
      ...getQuestions(false, QuestionType.COORDINATION),
    ]
    const actual = hasUnhandledComplementQuestions(questions)
    expect(actual).toBe(false)
  })
})
