export interface FunctionBlocker {
  id: string
}

export const TOGGLE_FUNCTION_BLOCKER = 'toggling function blocker'

export const addFunctionBlocker = (functionBlockers: FunctionBlocker[], newFunctionBlocker: FunctionBlocker): FunctionBlocker[] => {
  return [...functionBlockers, newFunctionBlocker]
}

export const removeFunctionBlocker = (functionBlockers: FunctionBlocker[], functionBlockerToRemove: FunctionBlocker): FunctionBlocker[] => {
  return functionBlockers.filter((functionBlocker) => functionBlocker.id !== functionBlockerToRemove.id)
}

export const toggleFunctionBlocker = (functionBlockers: FunctionBlocker[], functionBlocker: FunctionBlocker): FunctionBlocker[] => {
  const functionBlockerIndex = functionBlockers.findIndex((fn) => fn.id === functionBlocker.id)

  if (functionBlockerAlreadyExists(functionBlockerIndex)) {
    return removeFunctionBlocker(functionBlockers, functionBlocker)
  } else {
    return addFunctionBlocker(functionBlockers, functionBlocker)
  }
}

const functionBlockerAlreadyExists = (index: number) => {
  return index >= 0
}

export const isFunctionBlocked = (functionBlockers: FunctionBlocker[]): boolean => {
  return functionBlockers.length > 0
}

export const generateFunctionBlocker = (): FunctionBlocker => {
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
