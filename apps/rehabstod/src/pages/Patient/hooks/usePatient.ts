import { createContext, useContext, useState } from 'react'

export function usePatientState() {
  const [tabs, setTabs] = useState<Window[]>([])
  const openTabs = tabs.filter((window) => !window.closed)
  const hasOpenTabs = openTabs.length > 0
  // const blocker = useBlocker(hasOpenTabs)
  // const prevState = useRef(blocker.state)

  // useEffect(() => {
  //   if (blocker.state === 'blocked' && !hasOpenTabs) {
  //     blocker.reset()
  //   }
  //   prevState.current = blocker.state
  // }, [blocker, hasOpenTabs])

  const navigateToWebcert = (id: string) => {
    const tab = window.open(`${import.meta.env.VITE_WEBCERT_URL}/webcert/web/user/basic-certificate/lisjp/${id}/questions`, '_blank')
    if (tab) {
      setTabs([...tabs, tab])
    }
  }

  const closeTabs = () => {
    tabs.forEach((tab) => tab.close())
    setTabs([])
  }

  // useBeforeUnload(
  //   useCallback(
  //     (event) => {
  //       if (hasOpenTabs) {
  //         event.preventDefault()
  //         // eslint-disable-next-line no-param-reassign
  //       }
  //     },
  //     [hasOpenTabs]
  //   ),
  //   { capture: true }
  // )

  return { navigateToWebcert, hasOpenTabs, closeTabs, tabs: openTabs }
}

export const PatientContext = createContext<ReturnType<typeof usePatientState> | null>(null)

export const usePatient = () => {
  const context = useContext(PatientContext)

  if (context == null) {
    throw new Error('Patient components must be wrapped in <PatientContext.Provider />')
  }

  return context
}
