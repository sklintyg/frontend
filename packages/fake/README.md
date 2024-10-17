# `fake`

Generate fake mock data using zod schemas and fakerjs functions

## Usage

```typescript
const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

const fakeUser = fakeFromSchema(userSchema)

fakeUser() // { firstName: 'Olle', lastName: 'Johansson' }

// Override field
fakeUser({ firstName: 'Arnold' }) // { firstName: 'Arnold', lastName: 'Johansson' }

// Add seed for consistent result
fakeFromSchema(userSchema, { seed: 1234 })

// Override string mocks
fakeFromSchema(userSchema, { stringMap: { firstName: 'Arnold' } })() // { firstName: 'Arnold', lastName: 'Johansson' }
```

# Available faker functions

Read about the API at [fakerjs](https://fakerjs.dev/api/)
