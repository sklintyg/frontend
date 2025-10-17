import { fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { genderSummarySchema, sickLeaveSummary } from '../../schemas/sickLeaveSchema'

const fakeGenderSummarySchema = fakerFromSchema(genderSummarySchema)

export const fakeSickLeaveSummary = fakerFromSchemaFactory(sickLeaveSummary, () => ({
  genders: Array.from({ length: 2 }, fakeGenderSummarySchema),
}))
