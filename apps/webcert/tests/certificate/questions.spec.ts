import {
  fakeAnswer,
  fakeCategoryElement,
  fakeCertificate,
  fakeCertificateMetaData,
  fakeCertificateRelation,
  fakeComplement,
  fakeQuestion,
  fakeResourceLink,
  fakeTextFieldElement,
} from '../../src/faker'
import { CertificateStatus, QuestionType, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const certificate = fakeCertificate({
  data: {
    ...fakeTextFieldElement({ id: 'textfield', index: 2 }),
    ...fakeCategoryElement({ id: 'category', index: 1 }),
  },
  metadata: fakeCertificateMetaData({ status: CertificateStatus.SIGNED }),
  links: [
    fakeResourceLink({
      type: ResourceLinkType.QUESTIONS,
      name: 'Ärendekommunikation',
      description: 'Hantera kompletteringsbegäran, frågor och svar',
    }),
    fakeResourceLink({
      type: ResourceLinkType.CREATE_QUESTIONS,
      name: 'Ny fråga',
      description: 'Här kan du ställa en ny fråga till Försäkringskassan.',
    }),
  ],
})

test.beforeEach(async ({ routeJson }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })
})

test('should have question panel buttons', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByLabel('Kompletteringsbegäran')).toBeVisible()
  await expect(page.getByLabel('Administrativa frågor')).toBeVisible()
})

test('display information on missing complement questions', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByText('Det finns ingen kompletteringsbegäran på detta intyg.')).toBeVisible()
})

test('display information on missing administrative questions', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)

  await page.getByLabel('Administrativa frågor').click()
  await expect(page.getByRole('heading', { name: 'Här kan du ställa en ny fråga' })).toBeVisible()
  await expect(page.getByText('Det finns inga administrativa frågor för detta intyg.')).toBeVisible()
})

test('no questions available panel', async ({ page, routeJson }) => {
  const certificate = fakeCertificate({
    metadata: fakeCertificateMetaData({ status: CertificateStatus.SIGNED }),
    links: [
      fakeResourceLink({
        type: ResourceLinkType.QUESTIONS_NOT_AVAILABLE,
      }),
    ],
  })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })

  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByRole('tab', { name: 'Ärendekommunikation' })).toBeVisible()
  await expect(page.getByText('Kompletteringsbegäran och')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Kompletteringsbegäran och' })).toBeVisible()
  await expect(page.getByText('Intyget är inte skickat till')).toBeVisible()
  await expect(page.getByText('Det går därför inte att stä')).toBeVisible()
})

test.describe('Complement question', () => {
  test('reply to question', async ({ page, routeJson }) => {
    const question = fakeQuestion({
      type: QuestionType.COMPLEMENT,
      links: [fakeResourceLink({ type: ResourceLinkType.ANSWER_QUESTION })],
    })
    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })
    await page.goto(`/certificate/${certificate.metadata.id}`)

    const card = page.getByTestId('question-item-card')
    await expect(card).toBeVisible()
    await expect(card.getByTestId('question-item-author')).toContainText(question.author)
    await expect(card.getByTestId('question-item-subject')).toContainText(question.subject)

    await card.getByLabel('Svara').click()
    await expect(card.getByRole('textbox')).toBeEnabled()
    await expect(card.getByLabel('Skicka')).toBeDisabled()
    await expect(card.getByLabel('Avbryt')).toBeDisabled()

    const answer = fakeAnswer()
    await routeJson(`**/*/api/question/${question.id}/saveanswer`, {
      question: { ...question, answer: answer },
    })
    await routeJson(`**/*/api/question/${question.id}/sendanswer`, {
      question: { ...question, answer: answer },
    })
    await card.getByRole('textbox').fill(answer.message)
    await expect(card.getByLabel('Skicka')).toBeEnabled()
    await card.getByLabel('Skicka').click()
    await expect(card.getByTestId('question-item-answer-author')).toContainText(answer.author)
    await expect(card.getByTestId('question-item-answer-subject')).toContainText(`Re: ${question.subject}`)
    await expect(card.getByTestId('question-item-answer-message')).toContainText(answer.message)
  })

  test('open related certificate draft', async ({ page, routeJson }) => {
    const relation = fakeCertificateRelation()
    const relationCertificate = fakeCertificate({
      metadata: fakeCertificateMetaData({ id: relation.certificateId, status: CertificateStatus.UNSIGNED }),
    })
    const question = fakeQuestion({
      type: QuestionType.COMPLEMENT,
      links: [fakeResourceLink({ type: ResourceLinkType.ANSWER_QUESTION })],
      answeredByCertificate: relation,
    })
    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })
    await routeJson(`**/*/api/certificate/${relation.certificateId}`, { certificate: relationCertificate })
    await page.goto(`/certificate/${certificate.metadata.id}`)

    await page.getByRole('link', { name: 'Öppna utkastet' }).click()
    await expect(page.getByRole('heading', { name: relationCertificate.metadata.name })).toBeVisible()
  })

  test('highlight certificate question field', async ({ page, routeJson }) => {
    const complement = fakeComplement({ questionId: 'textfield' })
    const question = fakeQuestion({
      type: QuestionType.COMPLEMENT,
      complements: [complement],
      contactInfo: ['kontakt info'],
      links: [fakeResourceLink({ type: ResourceLinkType.ANSWER_QUESTION })],
    })
    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })

    await page.goto(`/certificate/${certificate.metadata.id}`)
    await expect(page.getByText('kontakt info')).toBeVisible()

    const highlightButton = page.getByRole('button', { name: 'Pil Visa kompletteringsbegä' })
    await expect(highlightButton).toBeVisible()
    await expect(highlightButton.getByText(complement.questionText)).toBeVisible()

    const highlightedQuestion = page.getByTestId('textfield-highlighted')
    await expect(highlightedQuestion).toBeVisible()
    await expect(highlightedQuestion.getByTestId('question-complement')).toBeVisible()
    await expect(highlightedQuestion.getByTestId('question-complement').getByText(complement.message)).toBeVisible()
  })

  test('display answered complement information', async ({ page, routeJson }) => {
    const question = fakeQuestion({
      type: QuestionType.COMPLEMENT,
      links: [fakeResourceLink({ type: ResourceLinkType.HANDLE_QUESTION })],
      answer: fakeAnswer(),
    })
    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })
    await page.goto(`/certificate/${certificate.metadata.id}`)

    await expect(page.getByText('Kompletteringsbegäran har besvarats med ett meddelande.')).toBeVisible()
  })

  test('mark complement as handled', async ({ page, routeJson }) => {
    const question = fakeQuestion({
      type: QuestionType.COMPLEMENT,
      links: [fakeResourceLink({ type: ResourceLinkType.HANDLE_QUESTION })],
      handled: false,
    })
    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })

    await page.goto(`/certificate/${certificate.metadata.id}`)

    const checkbox = page.getByTestId('question-item-card').getByText('Hanterad')
    await expect(checkbox).not.toBeChecked()
    await checkbox.click()

    const dialog = page.getByRole('dialog', { name: 'Markera som hanterad' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel('Markera som hanterad')).toBeEnabled()
    await expect(dialog.getByLabel('Avbryt')).toBeEnabled()

    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [{ ...question, handled: true }] })
    await routeJson(`**/*/api/question/${question.id}/handle`, { question: { ...question, handled: true } })
    await dialog.getByLabel('Markera som hanterad').click()

    await expect(checkbox).toBeChecked()
  })
})

test.describe('Administrativ question', () => {
  test('send a question', async ({ page, routeJson }) => {
    const question = fakeQuestion({ message: 'some message', type: QuestionType.OTHER, subject: 'Övrigt', author: 'Vince läkare' })
    const message = fakeQuestion().message
    await routeJson(`**/*/api/question`, { question: { ...question, certificateId: certificate.metadata.id } })

    await page.goto(`/certificate/${certificate.metadata.id}`)
    await page.getByLabel('Administrativa frågor').click()

    // Select question type
    await routeJson(`**/*/api/question/${question.id}`, { question: fakeQuestion({ ...question, type: QuestionType.OTHER }) })
    await page.getByLabel('Välj typ av fråga').selectOption(QuestionType.OTHER)
    await expect(page.getByText('Utkast sparat')).toBeVisible()

    // Add text
    await routeJson(`**/*/api/question/${question.id}`, {
      question: fakeQuestion({ ...question, type: QuestionType.OTHER, message }),
    })
    await page.getByTestId('question-textarea').fill(message)
    await expect(page.getByText('Utkast sparat')).toBeVisible()

    // Send
    await routeJson(`**/*/api/question/${question.id}/send`, {
      question: fakeQuestion({ ...question, type: QuestionType.OTHER, message }),
    })
    await page.getByTestId('question-send-btn').click()

    const card = page.getByTestId('question-item-card')
    await expect(card).toBeVisible()
    await expect(card.getByTestId('question-item-author')).toContainText(question.author)
    await expect(card.getByTestId('question-item-subject')).toContainText(question.subject)
    await expect(card.getByTestId('question-item-message')).toContainText(message)
  })

  test('reply to question', async ({ page, routeJson }) => {
    const question = fakeQuestion({
      type: QuestionType.OTHER,
      links: [fakeResourceLink({ type: ResourceLinkType.ANSWER_QUESTION })],
    })
    await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })

    await page.goto(`/certificate/${certificate.metadata.id}`)
    await page.getByLabel('Administrativa frågor').click()

    const card = page.getByTestId('question-item-card')
    await expect(card).toBeVisible()
    await expect(card.getByTestId('question-item-author')).toContainText(question.author)
    await expect(card.getByTestId('question-item-subject')).toContainText(question.subject)
    await expect(card.getByTestId('question-item-message')).toContainText(question.message)

    await card.getByLabel('Svara').click()
    await expect(card.getByRole('textbox')).toBeEnabled()
    await expect(card.getByLabel('Skicka')).toBeDisabled()
    await expect(card.getByLabel('Avbryt')).toBeDisabled()

    const answer = fakeAnswer()
    await routeJson(`**/*/api/question/${question.id}/saveanswer`, {
      question: { ...question, answer: answer },
    })
    await routeJson(`**/*/api/question/${question.id}/sendanswer`, {
      question: { ...question, answer: answer },
    })
    await card.getByRole('textbox').fill(answer.message)
    await expect(card.getByLabel('Skicka')).toBeEnabled()
    await card.getByLabel('Skicka').click()
    await expect(card.getByTestId('question-item-answer-author')).toContainText(answer.author)
    await expect(card.getByTestId('question-item-answer-subject')).toContainText(`Re: ${question.subject}`)
    await expect(card.getByTestId('question-item-answer-message')).toContainText(answer.message)
  })
})
