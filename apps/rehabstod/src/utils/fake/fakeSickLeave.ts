import { fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { diagnosKapitelSchema, diagnosKategoriSchema, genderSummarySchema, sickLeaveSummary } from '../../schemas/sickLeaveSchema'

export const fakeDiagnosKategori = fakerFromSchema(diagnosKategoriSchema)
export const fakeDiagnosKapitel = fakerFromSchemaFactory(diagnosKapitelSchema, {
  to: fakeDiagnosKategori(),
  from: fakeDiagnosKategori(),
})

export const fakeGenderSummarySchema = fakerFromSchema(genderSummarySchema)

export const fakeSickLeaveSummary = fakerFromSchemaFactory(sickLeaveSummary, {
  genders: Array.from({ length: 2 }, fakeGenderSummarySchema),
})
