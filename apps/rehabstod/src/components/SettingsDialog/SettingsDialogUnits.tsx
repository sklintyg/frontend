import { useId } from 'react'
import { User } from '../../schemas'
import { classNames } from '../../utils/classNames'

export function SettingsDialogUnits({ user, onChange }: { user: User; onChange: (value: string | null) => void }) {
  const id = useId()
  const noUnit = {
    id,
    name: 'Ingen',
  }
  return (
    <div>
      <div className={classNames('cursor-pointer', 'hover:bg-secondary-40', 'items-center', 'mb-1', 'ml-1')} onClick={() => onChange(null)}>
        <span className="">{noUnit.name}</span>
      </div>
      {user.vardgivare.map((careProvider) => (
        <div key={careProvider.id} className="ml-1 flex-1 items-center">
          {careProvider.vardenheter.map((careUnit) => (
            <div key={careUnit.namn}>
              <div
                key={careUnit.id}
                className={classNames('cursor-pointer', 'hover:bg-secondary-40', 'items-center', 'mb-1')}
                onClick={() => onChange(careUnit.id)}>
                <span className={user && user.valdVardenhet?.namn === careUnit.namn ? 'font-bold' : ''}>{careUnit.namn}</span>
              </div>
              {careUnit.mottagningar && careUnit.mottagningar.length > 0
                ? careUnit.mottagningar.map((reception) => (
                    <div key={reception.id}>
                      <div
                        key={reception.namn}
                        className={classNames('cursor-pointer', 'hover:bg-secondary-40', 'items-center', 'mb-1')}
                        onClick={() => onChange(reception.id)}>
                        <span className={user && user.valdVardenhet?.namn === reception.namn ? 'font-bold' : ''}>{reception.namn}</span>
                      </div>
                    </div>
                  ))
                : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
