export interface FunctionDisabler {
  id: string
}

export interface FunctionDisabled {
  functionDisabled: boolean
}

export const TOGGLE_FUNCTION_DISABLER = 'toggling function disabler'

export const addFunctionDisabler = (functionDisabler: FunctionDisabler[], newFunctionDisabler: FunctionDisabler): FunctionDisabler[] => {
  return [...functionDisabler, newFunctionDisabler]
}

export const removeFunctionDisabler = (
  functionDisablers: FunctionDisabler[],
  functionDisablerToRemove: FunctionDisabler
): FunctionDisabler[] => {
  return functionDisablers.filter((functionDisabler) => functionDisabler.id !== functionDisablerToRemove.id)
}

export const toggleFunctionDisabler = (functionDisablers: FunctionDisabler[], functionDisabler: FunctionDisabler): FunctionDisabler[] => {
  const functionDisablerIndex = functionDisablers.findIndex((fn) => fn.id === functionDisabler.id)

  if (functionDisablerAlreadyExists(functionDisablerIndex)) {
    return removeFunctionDisabler(functionDisablers, functionDisabler)
  } else {
    return addFunctionDisabler(functionDisablers, functionDisabler)
  }
}

const functionDisablerAlreadyExists = (index: number) => {
  return index >= 0
}

export const isFunctionDisabled = (functionDisablers: FunctionDisabler[]): boolean => {
  return functionDisablers.length > 0
}

export const generateFunctionDisabler = (): FunctionDisabler => {
  return { id: generateRandomId() }
}

function generateRandomId(): string {
  return (Date.now() * Math.random()).toString()
}
