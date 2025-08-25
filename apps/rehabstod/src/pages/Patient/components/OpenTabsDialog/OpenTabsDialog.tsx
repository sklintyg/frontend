import { useCallback, useEffect, useRef, useState } from 'react'
import { useBlocker } from 'react-router-dom'
import { Button } from '../../../../components/Button/Button'
import { Dialog } from '../../../../components/dialog/Dialog'
import { Heading } from '../../../../components/Heading/Heading'
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
      <Heading level={2} size="m">
        Öppnade patientfönster
      </Heading>
      <p>Du har öppnat ett eller flera intyg i Webcert. När du stänger patientvyn kommer flikarna med intyg i Webcert också att stängas.</p>
      <div slot="actions">
        <Button
          secondary
          onClick={() => {
            blocker.reset?.()
          }}
        >
          Avbryt
        </Button>
        <Button
          onClick={() => {
            closeTabs()
            blocker.proceed?.()
          }}
        >
          Stäng patientvy
        </Button>
      </div>
    </Dialog>
  )
}
