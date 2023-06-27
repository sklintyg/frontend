import { fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { genderSummarySchema, sickLeaveSummary } from '../../schemas/sickLeaveSchema'
import { diagnosKapitelSchema, diagnosKategoriSchema } from '../../schemas/diagnosisSchema'

export const fakeDiagnosKategori = fakerFromSchema(diagnosKategoriSchema)
export const fakeDiagnosKapitel = fakerFromSchemaFactory(diagnosKapitelSchema, {
  to: fakeDiagnosKategori(),
  from: fakeDiagnosKategori(),
})

export const fakeGenderSummarySchema = fakerFromSchema(genderSummarySchema)

export const fakeSickLeaveSummary = fakerFromSchemaFactory(sickLeaveSummary, {
  genders: Array.from({ length: 2 }, fakeGenderSummarySchema),
})
