import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import dispatchHelperMiddleware from '../test/dispatchHelperMiddleware'
import { resetState, toggleQuestionFunctionDisabler } from './questionActions'
import { generateFunctionDisabler } from '../../utils/functionDisablerUtils'

describe('Test question middleware', () => {
  let testStore: EnhancedStore

  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware),
    })
  })

  // If the state is being reset before any api-calls has been completed, a function disabler will be incorrectly
  // added. Therefor all function disabler should stay in the state util it´s been cleared by a new toggle action.
  it('keep any functional disablers when clearing state', () => {
    const functionDisabler = generateFunctionDisabler()
    testStore.dispatch(toggleQuestionFunctionDisabler(functionDisabler))
    testStore.dispatch(resetState())
    expect(testStore.getState().ui.uiQuestion.functionDisablers).toContain(functionDisabler)
  })
})
