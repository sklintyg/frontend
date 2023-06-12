import { useState } from 'react'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'

export function ErrorCode({ id }: { id: string }) {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)

  return (
    <div>
      <div className="flex justify-center">
        <p className="mr-2 font-bold">FEL-ID:</p>
        {id}
        <TooltipIcon
          description="Kopiera fel-id"
          name="copy-file"
          size="s"
          colorpreset={1}
          className="ml-2 inline cursor-pointer"
          onClick={() => {
            setDisplayCopyMessage(true)
            navigator.clipboard.writeText(id)
          }}
        />
      </div>

      {displayCopyMessage && <strong className="text-xs">Fel-id kopierat till urklipp.</strong>}
    </div>
  )
}
