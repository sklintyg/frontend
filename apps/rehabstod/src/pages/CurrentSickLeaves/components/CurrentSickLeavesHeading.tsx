import { User } from '../../../schemas/userSchema'

export function CurrentSickLeavesHeading({ user }: { user?: User }) {
  return (
    <>
      <div className="print:hidden">
        <h1 className="ids-heading-2">Pågående sjukfall</h1>
        <h2 className="ids-heading-3 mb-10">{user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h2>
        <hr className="opacity-40 " />
      </div>
      <div className="hidden print:block">
        <h1 className="ids-heading-3 mb-5">Pågående sjukfall på {user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h1>
      </div>
    </>
  )
}
