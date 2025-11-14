import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { z } from 'zod'
import { requiredAnswer } from './ppConstants'

const step03FormDataSchema = z.object({
  workgroup: z.string().min(1, requiredAnswer),
  speciality: z.string().min(1, requiredAnswer),
  prescriberCode: z.string().min(1, requiredAnswer),
})

type Step03FormData = z.infer<typeof step03FormDataSchema>

const initialState: {
  data: Step03FormData
  errors?: { [K in keyof Step03FormData]?: string[] }
} = {
  data: {
    workgroup: '',
    speciality: '',
    prescriberCode: '',
  },
  errors: undefined,
}

const ppStep03ReducerSlice = createSlice({
  name: 'step03',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof Step03FormData; value: string }>) => {
      state.data[action.payload.field] = action.payload.value
      if (state.errors) {
        state.errors[action.payload.field] = undefined
      }
    },
    validateData: (state) => {
      const zodError = step03FormDataSchema.safeParse(state.data).error
      state.errors = zodError ? z.flattenError(zodError).fieldErrors : undefined
    },
    clearAllErrors: (state) => {
      state.errors = undefined
    },
    resetForm: () => initialState,
  },
})

export const { reducer: ppStep03Reducer, name: ppStep03ReducerName } = ppStep03ReducerSlice
export const { updateField, validateData, clearAllErrors, resetForm } = ppStep03ReducerSlice.actions
