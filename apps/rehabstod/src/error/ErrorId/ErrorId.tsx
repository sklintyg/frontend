import { useState } from 'react'
import { TooltipIcon } from '../../components/TooltipIcon/TooltipIcon'

export function ErrorId({ errorId }: { errorId: string }) {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)

  const handleCopyClick = () => {
    setDisplayCopyMessage(true)
    navigator.clipboard.writeText(errorId)
  }

  return (
    <>
      <div className="mt-5 flex">
        <p className="mr-2 font-bold">FEL-ID:</p>
        {errorId}
        <TooltipIcon
          description="Kopiera fel-id"
          name="copy-file"
          size="s"
          colorpreset={1}
          className="ml-2 inline cursor-pointer"
          onClick={handleCopyClick}
        />
      </div>
      {displayCopyMessage && 'Fel-id kopierat till urklipp.'}
    </>
  )
}
