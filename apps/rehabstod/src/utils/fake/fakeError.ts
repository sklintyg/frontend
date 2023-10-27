import { fakerFromSchemaFactory } from '@frontend/fake'
import { errorPayloadSchema } from '../../schemas/errorPayloadSchema'

export const fakeError = fakerFromSchemaFactory(errorPayloadSchema, () => ({
  action: undefined,
}))
