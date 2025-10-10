import { fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { diagnosKapitelSchema, diagnosKategoriSchema } from '../../schemas/diagnosisSchema'
import { genderSummarySchema, sickLeaveSummary } from '../../schemas/sickLeaveSchema'

const fakeDiagnosKategori = fakerFromSchema(diagnosKategoriSchema)
const fakeDiagnosKapitel = fakerFromSchemaFactory(diagnosKapitelSchema, () => ({
  to: fakeDiagnosKategori(),
  from: fakeDiagnosKategori(),
}))

const fakeGenderSummarySchema = fakerFromSchema(genderSummarySchema)

export const fakeSickLeaveSummary = fakerFromSchemaFactory(sickLeaveSummary, () => ({
  genders: Array.from({ length: 2 }, fakeGenderSummarySchema),
}))
