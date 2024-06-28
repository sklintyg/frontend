import { createListenerMiddleware } from '@reduxjs/toolkit'
import { RootState } from './store'

// Best to define this in a separate file, to avoid importing
// from the store file into the rest of the codebase
export const { startListening, stopListening, middleware: listenerMiddleware } = createListenerMiddleware<RootState>()
