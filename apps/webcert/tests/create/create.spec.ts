import { fakePatient, fakeResourceLink } from '../../src/faker'
import { fakeCertificateConfirmationModal } from '../../src/faker/certificate/fakeCertificateConfirmationModal'
import { fakeCertificateType } from '../../src/faker/fakeCertificateType'
import { ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const patient = fakePatient()

test.beforeEach(async ({ routeJson }) => {
  routeJson(`**/*/api/patient/${patient.personId.id}`, { patient, status: 'FOUND' })
  routeJson(`**/*/api/certificate/type/${patient.personId.id}`, [])
})

test('have correct heading', async ({ page }) => {
  await page.goto(`/create/${btoa(patient.personId.id)}`)
  await expect(page.getByRole('heading', { name: 'Patientuppgifter' })).toBeVisible()
  await expect(page.getByRole('heading', { name: `${patient.fullName} - ${patient.personId.id}` })).toBeVisible()
})

test.describe('Confirmation modals', () => {
  test('Show db warning modal', async ({ page, routeJson }) => {
    routeJson(`**/*/api/certificate/type/${patient.personId.id}`, [
      fakeCertificateType({
        label: 'Dödsbevis',
        links: [
          fakeResourceLink({
            type: ResourceLinkType.CREATE_CERTIFICATE,
          }),
          fakeResourceLink({
            type: ResourceLinkType.CREATE_DODSBEVIS_CONFIRMATION,
          }),
        ],
      }),
    ])

    await page.goto(`/create/${btoa(patient.personId.id)}`)
    await page.getByRole('button', { name: 'Skapa intyg' }).click()

    await expect(page.getByRole('heading', { name: 'Kontrollera namn och' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Gå vidare' })).toBeDisabled()
  })

  test('Show missing related certificate modal', async ({ page, routeJson }) => {
    routeJson(`**/*/api/certificate/type/${patient.personId.id}`, [
      fakeCertificateType({
        label: 'Dödsorsaksintyg',
        links: [
          fakeResourceLink({
            type: ResourceLinkType.CREATE_CERTIFICATE,
          }),
          fakeResourceLink({
            type: ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION,
            body: `Är du säker att du vill skapa ett dödsorsaksintyg? Det finns inget dödsbevis i nuläget inom vårdgivaren.`,
          }),
        ],
      }),
    ])

    await page.goto(`/create/${btoa(patient.personId.id)}`)
    await page.getByRole('button', { name: 'Skapa intyg' }).click()

    const dialog = page.getByRole('dialog', { name: 'Dödsbevis saknas' })
    await expect(dialog.getByRole('heading', { name: 'Dödsbevis saknas' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Skapa intyg' })).toBeEnabled()
  })

  test('Show luaena modal', async ({ page, routeJson }) => {
    routeJson(`**/*/api/certificate/type/${patient.personId.id}`, [
      fakeCertificateType({
        label: 'Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga',
        links: [
          fakeResourceLink({
            type: ResourceLinkType.CREATE_CERTIFICATE,
          }),
          fakeResourceLink({
            type: ResourceLinkType.CREATE_LUAENA_CONFIRMATION,
          }),
        ],
      }),
    ])

    await page.goto(`/create/${btoa(patient.personId.id)}`)
    await page.getByRole('button', { name: 'Skapa intyg' }).click()

    await expect(page.getByRole('heading', { name: 'Kontrollera att du använder' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Gå vidare' })).toBeDisabled()
  })

  test('Show general confirmation modal', async ({ page, routeJson }) => {
    const confirmationModal = fakeCertificateConfirmationModal()
    routeJson(`**/*/api/certificate/type/${patient.personId.id}`, [
      fakeCertificateType({
        links: [
          fakeResourceLink({
            type: ResourceLinkType.CREATE_CERTIFICATE,
          }),
        ],
        confirmationModal,
      }),
    ])

    await page.goto(`/create/${btoa(patient.personId.id)}`)
    await page.getByRole('button', { name: 'Skapa intyg' }).click()

    await expect(page.getByRole('heading', { name: confirmationModal.title })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Gå vidare' })).toBeDisabled()
  })
})
