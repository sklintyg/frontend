import { fakeCategoryElement, fakeCertificate, fakeCertificateValue, fakeDiagnosesElement, fakeResourceLink } from '../../src/faker'
import { CertificateStatus, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'
import { A021 } from '../mocks/fmb/A021'
import { J20 } from '../mocks/fmb/J20'

const certificate = fakeCertificate({
  metadata: { status: CertificateStatus.UNSIGNED },
  data: {
    ...fakeDiagnosesElement({
      id: '6',
      parent: 'diagnos',
      index: 1,
      config: {
        text: 'Diagnos/diagnoser för sjukdom som orsakar nedsatt arbetsförmåga',
        description:
          'Ange vilken eller vilka sjukdomar som orsakar nedsatt arbetsförmåga. Den sjukdom som påverkar arbetsförmågan mest anges först. Diagnoskoden anges alltid med så många positioner som möjligt. Om patienten har fler än tre sjukdomar som påverkar arbetsförmågan anges dessa under "övriga upplysningar". ',
        terminology: [
          { id: 'ICD_10_SE', label: 'ICD-10-SE' },
          { id: 'KSH_97_P', label: 'KSH97-P (Primärvård)' },
        ],
        list: [{ id: 'diagnoser[0].row' }, { id: 'diagnoser[1].diagnoskod' }, { id: 'diagnoser[2].diagnoskod' }],
      },
      value: {
        list: [
          fakeCertificateValue.diagnosis({
            id: 'diagnoser[0].row',
            terminology: 'ICD_10_SE',
            code: 'J20',
            description: 'Akut bronkit',
          }),
          fakeCertificateValue.diagnosis({
            id: 'diagnoser[1].diagnoskod',
            terminology: 'ICD_10_SE',
            code: 'A021',
            description: 'Salmonellasepsis',
          }),
        ],
      },
    }),
    ...fakeCategoryElement({ id: 'diagnos', config: { text: 'Diagnos' } }),
  },
  links: [fakeResourceLink({ type: ResourceLinkType.FMB })],
})

test.beforeEach(async ({ routeJson }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })
  await routeJson(`**/*/api/fmb/J20`, J20)
  await routeJson(`**/*/api/fmb/A021`, A021)
})

test('certificate with no diagnoses', async ({ page, routeJson }) => {
  const certificate = fakeCertificate({
    metadata: { status: CertificateStatus.SIGNED },
    links: [fakeResourceLink({ type: ResourceLinkType.FMB })],
  })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}/validate`, { validationErrors: [] })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}/events`, { certificateEvents: [] })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })

  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByRole('tab', { name: 'FMB' })).toBeVisible()
  await expect(page.getByText('Diagnosspecifik information')).toBeVisible()
  await expect(page.getByText('Ange minst en diagnos för att')).toBeVisible()
})

test('populated panel', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByRole('tab', { name: 'FMB' })).toBeVisible()
  await expect(page.getByText('Diagnosspecifik information')).toBeVisible()
  await expect(page.getByText('Ange minst en diagnos för att')).toBeHidden()

  await expect(page.getByLabel('Diagnosis selection').getByText('Akut bronkit')).toBeVisible()
  await expect(page.getByText('Salmonellasepsis')).toBeVisible()

  await expect(page.locator('p').filter({ hasText: /^Akut bronkit$/ })).toBeVisible()
})

test('switch between diagnoses', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)
  await page.getByText('Salmonellasepsis').click()
  await expect(page.locator('p').filter({ hasText: /^Akut bronkit$/ })).toBeHidden()
  await expect(page.getByText('Salmonella och andra bakteriella tarminfektioner', { exact: true })).toBeVisible()
})
