import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import * as z from 'zod/mini'
import { requiredAlternative, requiredAnswer } from './ppConstants'

const step01FormDataSchema = z.object({
  position: z.string().check(z.minLength(1, requiredAlternative)),
  careUnitName: z.string().check(z.minLength(1, requiredAnswer)),
  typeOfCare: z.string().check(z.minLength(1, requiredAlternative)),
  healthcareServiceType: z.string().check(z.minLength(1, requiredAlternative)),
  workplaceCode: z.string(),
})

type Step01FormData = z.infer<typeof step01FormDataSchema>

const initialState: {
  data: Step01FormData
  errors?: { [K in keyof Step01FormData]?: string[] }
} = {
  data: {
    position: '',
    careUnitName: '',
    typeOfCare: '',
    healthcareServiceType: '',
    workplaceCode: '',
  },
  errors: undefined,
}

const ppStep01ReducerSlice = createSlice({
  name: 'step01',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof Step01FormData; value: string }>) => {
      state.data[action.payload.field] = action.payload.value
      if (state.errors) {
        state.errors[action.payload.field] = undefined
      }
    },
    validateData: (state) => {
      const zodError = step01FormDataSchema.safeParse(state.data).error
      state.errors = zodError ? z.flattenError(zodError).fieldErrors : undefined
    },
    resetForm: () => initialState,
  },
})

export const { reducer: ppStep01Reducer, name: ppStep01ReducerName } = ppStep01ReducerSlice
export const { updateField, validateData, resetForm } = ppStep01ReducerSlice.actions
