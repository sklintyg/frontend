import { Dialog } from '@frontend/components'
import { IDSButton } from '@frontend/ids-react-ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import { usePatient } from '../../hooks/usePatient'

export function OpenTabsDialog() {
  const { tabs, hasOpenTabs, closeTabs } = usePatient()
  const blocker = useBlocker(useCallback(() => tabs.filter((window) => !window.closed).length > 0, [tabs]))
  const prevState = useRef(blocker.state)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (blocker.state === 'blocked' && !hasOpenTabs) {
      blocker.reset()
    }
    prevState.current = blocker.state
  }, [blocker, hasOpenTabs])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [blocker.state])

  return (
    <Dialog
      dismissible={false}
      open={open}
      onOpenChange={(status) => {
        setOpen(status)
        if (status === false) {
          blocker.reset?.()
        }
      }}
    >
      <h2 className="ids-heading-2">Öppnade patientfönster</h2>
      <p>Du har öppnat ett eller flera intyg i Webcert. När du stänger patientvyn kommer flikarna med intyg i Webcert också att stängas.</p>
      <IDSButton
        slot="action"
        secondary
        onClick={() => {
          blocker.reset?.()
          setOpen(false)
        }}
      >
        Avbryt
      </IDSButton>
      <IDSButton
        slot="action"
        onClick={() => {
          closeTabs()
          blocker.proceed?.()
        }}
      >
        Stäng patientvy
      </IDSButton>
    </Dialog>
  )
}
