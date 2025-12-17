import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import * as z from 'zod/mini'
import { ppApi } from './ppApi'
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
  showValidation: boolean
  errors?: { [K in keyof Step01FormData]?: string[] }
} = {
  data: {
    position: '',
    careUnitName: '',
    typeOfCare: '',
    healthcareServiceType: '',
    workplaceCode: '',
  },
  showValidation: false,
  errors: undefined,
}

function validateState(state: typeof initialState) {
  if (state.showValidation === true) {
    const zodError = step01FormDataSchema.safeParse(state.data).error
    return zodError ? z.flattenError(zodError).fieldErrors : undefined
  }
}

const ppStep01ReducerSlice = createSlice({
  name: 'step01',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof Step01FormData; value: string }>) => {
      state.data[action.payload.field] = action.payload.value
      state.errors = validateState(state)
    },
    validateData: (state) => {
      state.showValidation = true
      state.errors = validateState(state)
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(ppApi.endpoints.getPrivatePractitioner.matchFulfilled, (state, { payload }) => {
      state.data.careUnitName = payload.careUnitName
      state.data.position = payload.position
      state.data.typeOfCare = payload.typeOfCare
      state.data.healthcareServiceType = payload.healthcareServiceType
      state.data.workplaceCode = payload.workplaceCode
    })
  },
})

export const { reducer: ppStep01Reducer, name: ppStep01ReducerName } = ppStep01ReducerSlice
export const { updateField, validateData, resetForm } = ppStep01ReducerSlice.actions
