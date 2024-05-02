import { fakeCategoryElement, fakeCertificate, fakeQuestion, fakeResourceLink, fakeTextAreaElement } from '../../src/faker'
import { CertificateStatus, QuestionType, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const id = 'foo'
const certificate = fakeCertificate({
  metadata: {
    id,
    name: 'Intyg om lasagne',
    patient: {
      firstName: 'Tolvan',
      middleName: 'TPU',
      lastName: 'Tolvanson',
      fullName: 'Tolvan TPU Tolvanson',
      personId: { id: '191212121212' },
    },
    status: CertificateStatus.UNSIGNED,
  },
  data: {
    ...fakeTextAreaElement({ parent: 'category', config: { label: 'text' } }),
    ...fakeCategoryElement({ id: 'category' }),
  },
  links: [
    fakeResourceLink({
      type: ResourceLinkType.READ_CERTIFICATE,
    }),
    fakeResourceLink({
      type: ResourceLinkType.EDIT_CERTIFICATE,
    }),
    fakeResourceLink({
      type: ResourceLinkType.QUESTIONS,
      name: 'Ärendekommunikation',
      description: 'Hantera kompletteringsbegäran, frågor och svar',
      enabled: true,
    }),
    fakeResourceLink({
      type: ResourceLinkType.CREATE_QUESTIONS,
      name: 'Ny fråga',
      description: 'Här kan du ställa en ny fråga till Försäkringskassan.',
      enabled: true,
    }),
  ],
})

test.beforeEach(async ({ routeJson }) => {
  await routeJson('**/*/api/certificate/*/validate', { validationErrors: [] })
  await routeJson('**/*/api/certificate/*/events', { certificateEvents: [] })
  await routeJson('**/*/api/certificate/*', { certificate })
  await routeJson(`**/*/api/question/${id}`, { questions: [] })
  await routeJson(`**/*/api/question/${id}/complements`, { questions: [] })
})

test('should have question panel buttons', async ({ page }) => {
  await page.goto(`/certificate/${id}`)
  await expect(page.getByLabel('Kompletteringsbegäran')).toBeVisible()
  await expect(page.getByLabel('Administrativa frågor')).toBeVisible()
})

test('display information on missing complement questions', async ({ page }) => {
  await page.goto(`/certificate/${id}`)
  await expect(page.getByText('Det finns ingen kompletteringsbegäran på detta intyg.')).toBeVisible()
})

test('display information on missing administrative questions', async ({ page }) => {
  await page.goto(`/certificate/${id}`)

  await page.getByLabel('Administrativa frågor').click()
  await expect(page.getByRole('heading', { name: 'Här kan du ställa en ny fråga' })).toBeVisible()
  await expect(page.getByText('Det finns inga administrativa frågor för detta intyg.')).toBeVisible()
})

test.describe('Administrativ questions', () => {
  test('send a question', async ({ page, routeJson }) => {
    const question = fakeQuestion({ message: '', type: QuestionType.COORDINATION, subject: 'Övrigt', author: 'Vince läkare' })
    await routeJson(`**/*/api/question`, { question: { ...question, certificateId: id } })

    await page.goto(`/certificate/${id}`)
    await page.getByLabel('Administrativa frågor').click()

    // Select question type
    // await routeJson(`**/*/api/question/${question.id}`, { question: fakeQuestion({ ...question, type: QuestionType.OTHER }) })
    // await page.getByLabel('Välj typ av fråga').selectOption({ label: 'Övrigt' })
    // // await page.getByLabel('Välj typ av fråga').selectOption(QuestionType.OTHER)
    // await expect(page.getByText('Utkast sparat')).toBeVisible()

    // Add text
    await routeJson(`**/*/api/question/${question.id}`, {
      question: fakeQuestion({ ...question, type: QuestionType.OTHER, message: 'Test' }),
    })
    await page.getByTestId('question-textarea').fill('Test')
    await expect(page.getByText('Utkast sparat')).toBeVisible()

    // Send
    await routeJson(`**/*/api/question/${question.id}/send`, {
      question: fakeQuestion({ ...question, type: QuestionType.OTHER, message: 'Test' }),
    })
    await page.getByTestId('question-send-btn').click()
    await page.waitForTimeout(2000)
    // await expect(page.getByText('Test', { exact: true })).toBeVisible()
  })
})
