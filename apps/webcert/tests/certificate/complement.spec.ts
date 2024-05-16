import {
  fakeCategoryElement,
  fakeCertificate,
  fakeCertificateRelation,
  fakeCertificateRelations,
  fakeComplement,
  fakeQuestion,
  fakeResourceLink,
  fakeTextFieldElement,
} from '../../src/faker'
import { fakeId } from '../../src/faker/fakeId'
import { CertificateRelationType, CertificateStatus, QuestionType, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const certificate = fakeCertificate({
  data: {
    ...fakeTextFieldElement({ id: 'textfield', index: 2 }),
    ...fakeCategoryElement({ id: 'category', index: 1 }),
  },
  metadata: { id: fakeId(), status: CertificateStatus.SIGNED },
  links: [fakeResourceLink({ type: ResourceLinkType.QUESTIONS }), fakeResourceLink({ type: ResourceLinkType.CREATE_QUESTIONS })],
})

const draft = fakeCertificate({
  metadata: {
    id: fakeId(),
    status: CertificateStatus.UNSIGNED,
    relations: fakeCertificateRelations({
      parent: fakeCertificateRelation({
        type: CertificateRelationType.COMPLEMENTED,
        certificateId: certificate.metadata.id,
      }),
    }),
  },
  data: { ...certificate.data },
  links: [fakeResourceLink({ type: ResourceLinkType.REMOVE_CERTIFICATE })],
})

const complement = fakeComplement({ questionId: 'textfield' })
const question = fakeQuestion({
  type: QuestionType.COMPLEMENT,
  complements: [complement],
  links: [
    fakeResourceLink({ type: ResourceLinkType.HANDLE_QUESTION }),
    fakeResourceLink({ type: ResourceLinkType.COMPLEMENT_CERTIFICATE }),
    fakeResourceLink({ type: ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE }),
  ],
})

test.beforeEach(async ({ routeJson }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}/complement`, { certificate })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}/answercomplement`, { certificate })
  await routeJson(`**/*/api/question/${certificate.metadata.id}`, { questions: [question] })
  await routeJson(`**/*/api/certificate/${draft.metadata.id}`, { certificate: draft })
})

test('create a new draft when complementing certificate', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)

  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()

  const complementButton = page.getByLabel('Komplettera', { exact: true })
  await expect(complementButton).toBeVisible()
  await complementButton.click()

  await expect(page.getByRole('heading', { name: draft.metadata.name })).toBeVisible()
  await expect(page.getByText('Försäkringskassan har begärt kompletteringar på intyget.')).toBeVisible()
})

test('navigate to new draft from complemented certificate', async ({ page, routeJson }) => {
  routeJson(`**/*/api/question/${certificate.metadata.id}`, {
    questions: [
      {
        ...question,
        answeredByCertificate: fakeCertificateRelation({
          certificateId: draft.metadata.id,
          type: CertificateRelationType.COMPLEMENTED,
          status: CertificateStatus.UNSIGNED,
        }),
      },
    ],
  })
  await page.goto(`/certificate/${certificate.metadata.id}`)

  await expect(page.getByText('Det finns redan en påbörjad komplettering.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Öppna utkastet' })).toBeVisible()
  await page.getByRole('link', { name: 'Öppna utkastet' }).click()
  await expect(page.getByRole('heading', { name: draft.metadata.name })).toBeVisible()
})

test('navigate back to previous certificate when complement draft is deleted', async ({ page }) => {
  await page.route(`**/*/api/certificate/*/${draft.metadata.version}`, (route) => route.fulfill())
  await page.goto(`/certificate/${draft.metadata.id}`)
  await page.getByLabel('Radera').click()
  const dialog = page.getByRole('dialog', { name: 'Radera utkast' })
  await expect(dialog.getByText('När du raderar utkastet tas')).toBeVisible()
  await dialog.getByLabel('Radera').click()
  await expect(page.getByText('Utkastet är borttaget')).toBeVisible()
  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()
})

test.describe('cannot complement certificate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/certificate/${certificate.metadata.id}`)
    await page.getByLabel('Kan ej komplettera', { exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Kan ej komplettera' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Ange varför intyget inte kan')).toBeVisible()
    await expect(dialog.getByText('Ingen ytterligare medicinsk')).toBeVisible()
    await expect(dialog.getByLabel('Skicka svar')).toBeDisabled()
    await expect(dialog.getByLabel('Avbryt')).toBeEnabled()
  })

  test('no further information possible', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Kan ej komplettera' })
    await dialog.getByText('Ingen ytterligare medicinsk').click()
    await expect(dialog.getByText('*Kommentera varför det inte ä')).toBeVisible()
    await dialog.getByTestId('question-answer-textarea').fill('Some reason')
    await expect(dialog.getByLabel('Skicka svar')).toBeEnabled()
    await dialog.getByLabel('Skicka svar').click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()
  })

  test('no one responsible', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Kan ej komplettera' })
    await dialog.getByText('Ingen på vårdenheten kan').click()
    await expect(dialog.getByText('Ingen medicinsk information')).toBeVisible()
    await expect(dialog.getByText('*Om intygsutfärdaren inte lä')).toBeVisible()
    await dialog.getByTestId('question-answer-textarea').fill('Some reason')
    await expect(dialog.getByLabel('Skicka svar')).toBeEnabled()
    await dialog.getByLabel('Skicka svar').click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()
  })
})
