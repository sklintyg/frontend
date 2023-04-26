import { useId } from 'react'
import { User } from '../../schemas'
import { classNames } from '../../utils/classNames'

export function SettingsDialogUnits({ user }: { user: User }) {
  const id = useId()
  const noUnit = {
    id,
    name: 'Ingen',
  }
  return (
    <div>
      {user.vardgivare.map((careProvider) => (
        <div key={careProvider.id} className="ml-1 flex-1 items-center">
          {careProvider.vardenheter.map((careUnit) => (
            <div key={careUnit.id}>
              <label htmlFor={careUnit.namn} className={classNames('cursor-pointer', 'items-center', 'mb-1')}>
                <span className="">{careUnit.namn}</span>
              </label>
              {careUnit.mottagningar && careUnit.mottagningar.length > 0
                ? careUnit.mottagningar.map((reception) => (
                    <div key={reception.id}>
                      <label htmlFor={reception.namn} className={classNames('cursor-pointer', 'items-center', 'mb-1')}>
                        <span className="">{reception.namn}</span>
                      </label>
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
