import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { z } from 'zod'
import { requiredAnswer } from './ppConstants'

const step02FormDataSchema = z.object({
  phoneNumber: z.string().min(1, requiredAnswer),
  email: z.string().regex(z.regexes.email, 'Ange en giltig e-postadress.'),
  emailRepeat: z.string().min(1, requiredAnswer),
  address: z.string().min(1, requiredAnswer),
  zipCode: z.string().regex(/^\d{5}$/, {
    message: 'Postnummer fylls i med fem siffror 0-9.',
  }),
  city: z.string(),
  municipality: z.string(),
  county: z.string(),
})

step02FormDataSchema.refine((obj) => obj.email === obj.emailRepeat, { error: 'E-postadresserna stämmer inte överens med varandra.' })

type Step02FormData = z.infer<typeof step02FormDataSchema>

const initialState: {
  data: Step02FormData
  errors?: { [K in keyof Step02FormData]?: string[] }
} = {
  data: {
    phoneNumber: '',
    email: '',
    emailRepeat: '',
    address: '',
    zipCode: '',
    city: '',
    municipality: '',
    county: '',
  },
  errors: undefined,
}

const ppStep02ReducerSlice = createSlice({
  name: 'step02',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof Step02FormData; value: string }>) => {
      state.data[action.payload.field] = action.payload.value
      if (state.errors) {
        state.errors[action.payload.field] = undefined
      }
    },
    validateData: (state) => {
      const zodError = step02FormDataSchema.safeParse(state.data).error
      state.errors = zodError ? z.flattenError(zodError).fieldErrors : undefined
    },
    clearAllErrors: (state) => {
      state.errors = undefined
    },
    resetForm: () => initialState,
  },
})

export const { reducer: ppStep02Reducer, name: ppStep02ReducerName } = ppStep02ReducerSlice
export const { updateField, validateData, clearAllErrors, resetForm } = ppStep02ReducerSlice.actions
