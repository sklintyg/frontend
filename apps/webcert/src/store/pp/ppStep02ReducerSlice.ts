import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createListenerMiddleware, createSlice } from '@reduxjs/toolkit'
import * as z from 'zod/mini'
import type { ZipCodeInfo } from '../../types/zipCode'
import { api } from '../api'
import type { RootState } from '../reducer'
import { ppApi } from './ppApi'
import { equalEmail, requiredAnswer } from './ppConstants'

const step02FormDataSchema = z
  .object({
    phoneNumber: z.string().check(z.minLength(1, 'Ange telefonnummer.')),
    email: z.string().check(z.minLength(1, requiredAnswer)).check(z.regex(z.regexes.email, 'Ange en giltig e-postadress.')),
    emailRepeat: z.string().check(z.minLength(1, requiredAnswer)),
    address: z.string().check(z.minLength(1, requiredAnswer)),
    zipCode: z.string().check(z.minLength(1, 'Postnummer fylls i med fem siffror 0-9.')),
    city: z.string().check(z.minLength(1, requiredAnswer)),
    municipality: z.string().check(z.minLength(1, 'Uppgift om kommun har fler träffar. Ange den kommun som är rätt.')),
    county: z.string().check(z.minLength(1, requiredAnswer)),
  })
  .check(
    z.refine(({ email, emailRepeat }) => email === emailRepeat, {
      error: equalEmail,
      path: ['email'],
    })
  )
  .check(
    z.refine(({ email, emailRepeat }) => email === emailRepeat, {
      error: equalEmail,
      path: ['emailRepeat'],
    })
  )

type Step02FormData = z.infer<typeof step02FormDataSchema>

const initialState: {
  data: Step02FormData
  zipCodeInfo: ZipCodeInfo[]
  showValidation: boolean
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
  zipCodeInfo: [],
  showValidation: false,
  errors: undefined,
}

function validateState(state: typeof initialState) {
  if (state.showValidation === true) {
    const zodError = step02FormDataSchema.safeParse(state.data).error
    let errors = zodError ? z.flattenError(zodError).fieldErrors : undefined
    if (state.zipCodeInfo.length === 0 && !errors?.zipCode) {
      errors = { ...errors, zipCode: ['Ange ett giltigt postnummer.'] }
    }
    return errors
  }
}

const zipCodeInfoUpdate = createAction<ZipCodeInfo[]>('zipCodeInfoUpdate')

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
        state.zipCodeInfo = []
      }
      state.errors = validateState(state)
    },
    validateData: (state) => {
      state.showValidation = true
      state.errors = validateState(state)
    },
    clearAllErrors: (state) => {
      state.errors = undefined
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(zipCodeInfoUpdate, (state, { payload: zipCodeInfo }) => {
      if (!zipCodeInfo.find(({ municipality }) => state.data.municipality === municipality)) {
        state.data.city = ''
        state.data.county = ''
        state.data.municipality = ''
        if (zipCodeInfo.length === 1) {
          state.data.city = zipCodeInfo[0].city
          state.data.county = zipCodeInfo[0].county
          state.data.municipality = zipCodeInfo[0].municipality
        }
      }
      state.zipCodeInfo = zipCodeInfo
      state.errors = validateState(state)
    })
    builder.addMatcher(ppApi.endpoints.getPrivatePractitioner.matchFulfilled, (state, { payload }) => {
      state.data.phoneNumber = payload.phoneNumber
      state.data.email = payload.email
      state.data.emailRepeat = payload.email
      state.data.address = payload.address
      state.data.zipCode = payload.zipCode
      state.data.city = payload.city
      state.data.municipality = payload.municipality
      state.data.county = payload.county

      state.errors = validateState(state)
    })
  },
})

const listener = createListenerMiddleware<RootState>()

/***
 * A listener that updates zipCodeInfo when zipCode is entered.
 * This uses cancelActiveListeners and delay to debounce requests.
 */
listener.startListening({
  actionCreator: ppStep02ReducerSlice.actions.updateField,
  effect: async (action, { cancelActiveListeners, delay, dispatch, getState }) => {
    const { field, value } = action.payload
    if (field === 'zipCode' && value !== '') {
      const { data: zipCodeInfo, isUninitialized } = ppApi.endpoints.getZipCodeInfo.select(value)(getState())

      dispatch(zipCodeInfoUpdate([]))

      cancelActiveListeners()

      await delay(250)

      if (!zipCodeInfo || isUninitialized) {
        dispatch(ppApi.endpoints.getZipCodeInfo.initiate(value))
      } else {
        dispatch(zipCodeInfoUpdate(zipCodeInfo))
      }
    }
  },
})

listener.startListening({
  matcher: api.endpoints.getZipCodeInfo.matchFulfilled,
  effect: async (action, { dispatch }) => {
    dispatch(zipCodeInfoUpdate(action.payload))
  },
})

listener.startListening({
  matcher: api.endpoints.getZipCodeInfo.matchPending,
  effect: async (_, { dispatch }) => {
    dispatch(zipCodeInfoUpdate([]))
  },
})

listener.startListening({
  matcher: ppApi.endpoints.getPrivatePractitioner.matchFulfilled,
  effect: async (action, { dispatch }) => {
    if (action.payload.zipCode.length > 0) {
      dispatch(api.endpoints.getZipCodeInfo.initiate(action.payload.zipCode))
    }
  },
})

export const { middleware: ppStep02Middleware } = listener
export const { reducer: ppStep02Reducer, name: ppStep02ReducerName } = ppStep02ReducerSlice
export const { updateField, validateData, resetForm } = ppStep02ReducerSlice.actions
