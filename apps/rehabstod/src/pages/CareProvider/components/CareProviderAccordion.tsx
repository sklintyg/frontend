import { IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { Radio } from '../../../components/Form/Radio'
import { Vardenhet, Vardgivare } from '../../../schemas'

export function CareProviderAccordion({
  unit,
  provider,
  selectedRadio,
  handleChooseUnit,
  children,
}: {
  unit: Vardenhet
  provider: Vardgivare
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenhet) => void
  children: ReactNode
}) {
  return (
    <details className="group">
      <summary className="ml-5 flex cursor-pointer items-center space-x-2">
        <span className="group-open:rotate-270 inline-block h-3 w-3 origin-center rotate-90">
          <IDSIcon name="chevron" width="100%" height="100%" className="h-full w-full" />
        </span>
        <div className="flex w-full justify-between">
          <label
            htmlFor={unit.id}
            className={`flex cursor-pointer items-center ${selectedRadio === unit.id ? 'font-bold' : ''} w-full justify-between`}>
            <span>{unit.namn}</span>
            <Radio
              name="selectedUnit"
              value={unit.namn}
              id={unit.id}
              onChange={(event) => handleChooseUnit(event, provider, unit)}
              onClick={(e) => {
                const detailsEl = e.currentTarget.closest('details')
                if (detailsEl) {
                  detailsEl.setAttribute('open', '')
                }
              }}
            />
          </label>
        </div>
      </summary>
      <div className="ml-5">{children}</div>
    </details>
  )
}
