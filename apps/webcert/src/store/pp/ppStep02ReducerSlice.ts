import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import * as z from 'zod/mini'
import { api } from '../api'
import { equalEmail, requiredAnswer } from './ppConstants'

const step02FormDataSchema = z
  .object({
    phoneNumber: z.string().check(z.minLength(1, 'Ange telefonnummer.')),
    email: z.string().check(z.minLength(1, requiredAnswer)).check(z.regex(z.regexes.email, 'Ange en giltig e-postadress.')),
    emailRepeat: z.string().check(z.minLength(1, requiredAnswer)),
    address: z.string().check(z.minLength(1, requiredAnswer)),
    zipCode: z
      .string()
      .check(z.minLength(1, 'Postnummer fylls i med fem siffror 0-9.'))
      .check(
        z.regex(/^\d{5}$/, {
          message: 'Ange ett giltigt postnummer.',
        })
      ),
    city: z.string().check(z.minLength(1, requiredAnswer)),
    municipality: z.string().check(z.minLength(1, 'Uppgift om kommun har fler träffar. Ange den kommun som är rätt.')),
    county: z.string().check(z.minLength(1, requiredAnswer)),
  })
  .check(
    z.refine((obj) => obj.email === obj.emailRepeat, {
      error: equalEmail,
      path: ['email'],
    })
  )
  .check(
    z.refine((obj) => obj.email === obj.emailRepeat, {
      error: equalEmail,
      path: ['emailRepeat'],
    })
  )

type Step02FormData = z.infer<typeof step02FormDataSchema>

const initialState: {
  data: Step02FormData
  errors?: { [K in keyof Step02FormData]?: string[] }
  lastRequestedZip?: string | null
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
  lastRequestedZip: null,
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
      if (action.payload.field === 'zipCode' && action.payload.value === '') {
        state.data.city = ''
        state.data.county = ''
        state.data.municipality = ''
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
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getZipCodeInfo.matchFulfilled, (state, { payload }) => {
      if (payload.length === 1) {
        state.data.city = payload[0].city
        state.data.county = payload[0].county
        state.data.municipality = payload[0].municipality
      }
    })
    builder.addMatcher(api.endpoints.getZipCodeInfo.matchPending, (state, payload) => {
      const newZip = payload.meta.arg.originalArgs

      if (newZip !== state.lastRequestedZip) {
        state.data.city = ''
        state.data.county = ''
        state.data.municipality = ''
      }

      state.lastRequestedZip = newZip
    })
  },
})

export const { reducer: ppStep02Reducer, name: ppStep02ReducerName } = ppStep02ReducerSlice
export const { updateField, validateData, resetForm } = ppStep02ReducerSlice.actions
