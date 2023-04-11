import { fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { diagnosKapitelSchema, diagnosKategoriSchema } from '../../schemas/sickLeaveSchema'

export const fakeDiagnosKategori = fakerFromSchema(diagnosKategoriSchema)
export const fakeDiagnosKapitel = fakerFromSchemaFactory(diagnosKapitelSchema, {
  to: fakeDiagnosKategori(),
  from: fakeDiagnosKategori(),
})
