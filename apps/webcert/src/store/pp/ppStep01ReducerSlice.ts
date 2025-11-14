import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { z } from 'zod'
import { requiredAlternative, requiredAnswer } from './ppConstants'

const step01FormDataSchema = z.object({
  personId: z.string(),
  name: z.string(),
  occupation: z.string().min(1, requiredAlternative),
  position: z.string().min(1, requiredAnswer),
  businessName: z.string().min(1, requiredAnswer),
  careForm: z.string().min(1, requiredAlternative),
  businessType: z.string().min(1, requiredAlternative),
  workplaceCode: z.string(),
})

type Step01FormData = z.infer<typeof step01FormDataSchema>

const initialState: {
  data: Step01FormData
  errors?: { [K in keyof Step01FormData]?: string[] }
} = {
  data: {
    personId: '',
    name: '',
    occupation: '',
    position: '',
    businessName: '',
    careForm: '',
    businessType: '',
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
    clearAllErrors: (state) => {
      state.errors = undefined
    },
    resetForm: () => initialState,
  },
})

export const { reducer: ppStep01Reducer, name: ppStep01ReducerName } = ppStep01ReducerSlice
export const { updateField, validateData, clearAllErrors, resetForm } = ppStep01ReducerSlice.actions
