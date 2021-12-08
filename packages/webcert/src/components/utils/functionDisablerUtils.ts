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
  return { id: uuidv4() }
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
